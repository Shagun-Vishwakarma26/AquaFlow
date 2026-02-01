const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/* ---------- MONGODB CONNECTION ---------- */
mongoose.connect("mongodb://127.0.0.1:27017/aquaflow", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log(err));

/* ---------- SCHEMAS ---------- */
const TankerSchema = new mongoose.Schema({
  driverName: String,
  phone: String,
  capacity: String,
  latitude: Number,
  longitude: Number,
  status: String
});

const BookingSchema = new mongoose.Schema({
  tankerId: mongoose.Schema.Types.ObjectId,
  time: String
});

const Tanker = mongoose.model("Tanker", TankerSchema);
const Booking = mongoose.model("Booking", BookingSchema);

const OTP = "4321";

/* ---------- ROUTES ---------- */
app.get("/tankers", async (req, res) => {
  const tankers = await Tanker.find({ status: "Available" });
  res.json({ count: tankers.length, data: tankers });
});

app.post("/book", async (req, res) => {
  const tanker = await Tanker.findOne({ status: "Available" });
  if (!tanker) {
    return res.json({ success: false, message: "No tankers available" });
  }

  tanker.status = "Booked";
  await tanker.save();

  await Booking.create({
    tankerId: tanker._id,
    time: new Date().toLocaleString()
  });

  res.json({ success: true, message: "Tanker allocated fairly" });
});

app.post("/send-otp", (req, res) => {
  res.json({ otp: OTP });
});

app.post("/verify-otp", (req, res) => {
  res.json({
    success: req.body.otp === OTP,
    message: req.body.otp === OTP ? "OTP Verified" : "Invalid OTP"
  });
});

app.post("/payment", (req, res) => {
  res.json({ success: true, message: "Payment Successful" });
});

app.listen(3000, () => {
  console.log("🚰 AquaFlow running at http://localhost:3000");
});
