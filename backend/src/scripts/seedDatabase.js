import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../features/auth/User.model.js";
import { Client, Case, Reminder, ActivityLog } from "../features/secretary/secretary.model.js";
import AdminReminder from "../features/dashboard/models/model.reminder.js";

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to database
    console.log("🔌 Connecting to database...");
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("✅ Database connected successfully");

    // ===== STEP 1: Delete all existing data =====
    console.log("\n🗑️  Deleting all existing data...");

    await User.deleteMany({});
    console.log("   ✓ Users deleted");

    await Client.deleteMany({});
    console.log("   ✓ Clients deleted");

    await Case.deleteMany({});
    console.log("   ✓ Cases deleted");

    await Reminder.deleteMany({});
    console.log("   ✓ Reminders deleted");

    await ActivityLog.deleteMany({});
    console.log("   ✓ Activity logs deleted");

    await AdminReminder.deleteMany({});
    console.log("   ✓ Admin reminders deleted");

    console.log("\n✅ All data deleted successfully");

    // ===== STEP 2: Create fresh users for each role =====
    console.log("\n👤 Creating new users...");

    const users = [
      {
        name: "Director User",
        email: "director@law.com",
        password: "director123",
        phone: "923001234567",
        role: "director",
        status: "active",
        isVerified: true,
        profilePic: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
      },
      {
        name: "Secretary User",
        email: "secretary@law.com",
        password: "secretary123",
        phone: "923001234568",
        role: "secretary",
        status: "active",
        isVerified: true,
        profilePic: "https://cdn-icons-png.flaticon.com/512/3135/3135789.png"
      },
      {
        name: "Lawyer User",
        email: "lawyer@law.com",
        password: "lawyer123",
        phone: "923001234569",
        role: "lawyer",
        status: "active",
        isVerified: true,
        profilePic: "https://cdn-icons-png.flaticon.com/512/3135/3135823.png"
      },
      {
        name: "Approving Lawyer User",
        email: "approving@law.com",
        password: "approving123",
        phone: "923001234570",
        role: "approvingLawyer",
        status: "active",
        isVerified: true,
        profilePic: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
      },
      {
        name: "Accountant User",
        email: "accountant@law.com",
        password: "accountant123",
        phone: "923001234571",
        role: "accountant",
        status: "active",
        isVerified: true,
        profilePic: "https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
      }
    ];

    // Create users one by one to trigger password hashing middleware
    const createdUsers = [];
    for (const userData of users) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }

    console.log("\n✅ Users created successfully:\n");
    createdUsers.forEach(user => {
      console.log(`   📧 ${user.role.toUpperCase()}`);
      console.log(`      Email: ${user.email}`);
      console.log(`      Password: ${users.find(u => u.email === user.email).password}`);
      console.log(`      Name: ${user.name}`);
      console.log(`      ID: ${user._id}`);
      console.log("");
    });

    console.log("🎉 Database seeded successfully!");
    console.log("\n📝 Login Credentials Summary:");
    console.log("================================");
    users.forEach(user => {
      console.log(`${user.role.toUpperCase()}: ${user.email} / ${user.password}`);
    });
    console.log("================================\n");

    // Close connection
    await mongoose.connection.close();
    console.log("✅ Database connection closed");
    process.exit(0);

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();

