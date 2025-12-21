import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: [true, "Please add a name"] },
  email: {
    type: String,
    unique: true,
    required: [true, "Please add an email"],
    validate: [validator.isEmail, "Please provide a valid email"]
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: [8, "Password must be at least 8 characters"],
    validate: {
      validator: function (v) {
        // Skip validation if password is being hashed (already modified)
        // OR validate the plain text before it is hashed in pre-save.
        // Mongoose validation runs before pre-save hooks.
        // So 'v' here is the plain text password.
        return validator.isStrongPassword(v, {
          minLength: 8,
          minLowercase: 0,
          minUppercase: 0,
          minNumbers: 1,
          minSymbols: 1
        });
      },
      message: "Password must contain at least 8 characters, 1 number, and 1 special character"
    }
  },
  phone: { type: String },
  profilePic: { type: String },
  role: { type: String, default: "user", enum: ["user", "organizer", "admin"] },
  isBlocked: { type: Boolean, default: false }, // Block status
  walletBalance: { type: Number, default: 0 },
  location: { type: String },

  // Organizer Specific Fields (KYC)
  organizationDetails: {
    orgName: { type: String },
    address: { type: String }
  },
  bankDetails: {
    accountHolderName: { type: String },
    bankName: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String }
  },
  kycStatus: {
    type: String,
    default: "pending",
    enum: ["pending", "approved", "rejected", "not_submitted"]
  },
}, { timestamps: true });

// Encrypt password using bcrypt
// Encrypt password using bcrypt
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
