import express, { Request, Response, NextFunction } from "express";
import { User } from "./models/User";
import { Service } from "./models/Service";
import { Order } from "./models/Order";
import { Coupon } from "./models/Coupon";
import { Review } from "./models/Review";

export const router = express.Router();

// ----------------------- EXTEND EXPRESS REQUEST -----------------------
declare module "express" {
  interface Request {
    userId?: string;
    userRole?: "customer" | "admin";
  }
}

// Simple in-memory token map (replace with JWT in production)
const sessions = new Map<string, { userId: string; role: "customer" | "admin" }>();

function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// ----------------------- MIDDLEWARE -----------------------
async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token || !sessions.has(token)) return res.status(401).json({ message: "Authentication required" });
  req.userId = sessions.get(token)!.userId;
  req.userRole = sessions.get(token)!.role;
  next();
}

function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.userRole !== "admin") return res.status(403).json({ message: "Admin access required" });
  next();
}

// ----------------------- AUTH -----------------------
router.post("/auth/register", async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) return res.status(400).json({ message: "All fields required" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({ name, email, phone, password });
    const token = generateToken();
    sessions.set(token, { userId: user._id.toString(), role: user.role });

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error });
  }
});

router.post("/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken();
    sessions.set(token, { userId: user._id.toString(), role: user.role });

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
});

router.post("/auth/logout", authMiddleware, (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token) sessions.delete(token);
  res.json({ message: "Logged out successfully" });
});

router.get("/auth/me", authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user", error });
  }
});

// ----------------------- SERVICES -----------------------
router.get("/services", async (_req: Request, res: Response) => {
  try {
    const services = await Service.find({ isActive: true });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch services", error });
  }
});

router.post("/services", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const service = await Service.create(req.body);
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: "Failed to create service", error });
  }
});

// ----------------------- ORDERS -----------------------
router.get("/orders", authMiddleware, async (req: Request, res: Response) => {
  try {
    const orders =
      req.userRole === "admin"
        ? await Order.find().populate("userId").populate("items")
        : await Order.find({ userId: req.userId }).populate("items");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
});

router.post("/orders", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { items, address, couponCode, pickupDate, pickupTime, deliveryDate, deliveryTime, paymentMethod, subtotal, discount, total } = req.body;

    if (!req.userId) return res.status(400).json({ message: "User ID missing" });

    const order = await Order.create({
      userId: req.userId,
      items,
      address,
      couponCode,
      status: "Order Placed",
      subtotal: subtotal || 0,
      discount: discount || 0,
      total: total || subtotal || 0,
      pickupDate,
      pickupTime,
      deliveryDate,
      deliveryTime,
      paymentMethod,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.json({ id: order._id, ...order.toObject() });
  } catch (error) {
    res.status(500).json({ message: "Failed to create order", error });
  }
});

router.post("/coupons/validate", async (req: Request, res: Response) => {
  try {
    const { code, orderTotal } = req.body;
    const coupon = await Coupon.findOne({ code, isActive: true });
    
    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon code" });
    }
    
    const now = new Date();
    if (coupon.validFrom > now || coupon.validUntil < now) {
      return res.status(400).json({ message: "Coupon has expired" });
    }
    
    if (coupon.minOrder && orderTotal < coupon.minOrder) {
      return res.status(400).json({ message: `Minimum order amount is ₹${coupon.minOrder}` });
    }
    
    let discount = 0;
    if (coupon.type === "percentage") {
      discount = (orderTotal * coupon.value) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.value;
    }
    
    res.json({ discount, message: "Coupon applied successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to validate coupon", error });
  }
});

// ----------------------- COUPONS -----------------------
router.get("/coupons", async (_req: Request, res: Response) => {
  try {
    const coupons = await Coupon.find({ isActive: true });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch coupons", error });
  }
});

router.post("/coupons", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: "Failed to create coupon", error });
  }
});

// ----------------------- REVIEWS -----------------------
router.get("/reviews", async (_req: Request, res: Response) => {
  try {
    const reviews = await Review.find()
      .populate<{ userId: any }>("userId", "name email")
      .populate<{ orderId: any }>("orderId", "status pickupDate deliveryDate");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews", error });
  }
});

router.post("/reviews", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { orderId, rating, comment } = req.body;
    if (!req.userId) return res.status(400).json({ message: "User ID missing" });

    const review = await Review.create({
      orderId,
      userId: req.userId,
      rating,
      comment: comment || "",
      createdAt: new Date(),
    });

    const populatedReview = await review.populate("userId", "name email");
    res.json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: "Failed to create review", error });
  }
});

// ----------------------- ADMIN: CUSTOMERS -----------------------
router.get("/admin/customers", authMiddleware, adminMiddleware, async (_req: Request, res: Response) => {
  try {
    const users = await User.find({ role: "customer" });
    const orders = await Order.find();
    
    const customersWithStats = users.map(user => {
      const userOrders = orders.filter(o => o.userId?.toString() === user._id.toString());
      const totalSpent = userOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      return {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        totalOrders: userOrders.length,
        totalSpent,
        joinedAt: user.createdAt,
      };
    });
    
    res.json(customersWithStats);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch customers", error });
  }
});

// ----------------------- ADMIN: ORDERS -----------------------
router.get("/admin/orders", authMiddleware, adminMiddleware, async (_req: Request, res: Response) => {
  try {
    const orders = await Order.find().populate("userId").sort({ createdAt: -1 });
    const formattedOrders = orders.map(order => ({
      id: order._id,
      userId: (order.userId as any)?._id,
      customerName: (order.userId as any)?.name,
      customerPhone: (order.userId as any)?.phone,
      items: order.items,
      total: order.total,
      status: order.status,
      pickupDate: order.pickupDate,
      pickupTime: order.pickupTime,
      deliveryDate: order.deliveryDate,
      deliveryTime: order.deliveryTime,
      address: order.address,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus || "pending",
      createdAt: order.createdAt,
    }));
    res.json(formattedOrders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
});

router.put("/admin/orders/:id/status", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status", error });
  }
});

// ----------------------- ADMIN: COUPONS -----------------------
router.get("/admin/coupons", authMiddleware, adminMiddleware, async (_req: Request, res: Response) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons.map(c => ({
      id: c._id,
      code: c.code,
      type: c.type,
      value: c.value,
      minOrder: c.minOrder,
      maxDiscount: c.maxDiscount,
      usageLimit: c.usageLimit,
      usedCount: c.usedCount || 0,
      validFrom: c.validFrom,
      validUntil: c.validUntil,
      isActive: c.isActive,
    })));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch coupons", error });
  }
});

router.post("/admin/coupons", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: "Failed to create coupon", error });
  }
});

router.put("/admin/coupons/:id", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: "Failed to update coupon", error });
  }
});

router.delete("/admin/coupons/:id", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Coupon.findByIdAndDelete(id);
    res.json({ message: "Coupon deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete coupon", error });
  }
});

// ----------------------- ADMIN: SERVICES (Update/Delete) -----------------------
router.put("/services/:id", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndUpdate(id, req.body, { new: true });
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: "Failed to update service", error });
  }
});

router.delete("/services/:id", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Service.findByIdAndDelete(id);
    res.json({ message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete service", error });
  }
});
