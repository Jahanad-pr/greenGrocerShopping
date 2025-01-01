const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  delivery_address: {
    type: Object,
    required: true,
  },
  payment_method: {
    type: String,
    required: true,
  },
  coupon: 
    {
      code: {
        type: String,
        // required: true,
      },
      amount: {
        type: Number,
        // required: true,
      },
    }
    // Optional, defaults to empty string
  ,
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Reference to the Item model
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  }],
  price: {
    grandPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    others:{
      type: Object,
      default:{ tax:0 , delivery:0, totel:0 }
    }
  },
  order_id: {
    type: String,
    required: true,
    unique: true, // Ensures no duplicate order IDs
  },
  time: {
    type: Date,
    default: Date.now,
  },
  total_quantity: {
    type: Number,
    required: true,
  },
  order_status: {
    type: String,
    enum: ["Pending","Processed", "Shipped" , "Delivered", "Cancelled"], // Possible statuses
    default: "Processed",
  },
  payment_status: {
    type: String,
    enum: ["pending", "paid", "completed" , "failed","cancelled"], // Possible payment statuses
    default: "pending",
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
