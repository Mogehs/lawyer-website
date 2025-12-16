// Test component for WhatsApp integration
import React from "react";

const WhatsAppTestNotifications = () => {
  const testCaseAssignment = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/whatsapp/notify/case-assignment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust based on your auth
          },
          credentials: "include",
          body: JSON.stringify({
            lawyerData: {
              name: "John Doe",
              email: "john@example.com",
              phone: "923120201709", // Test phone number
            },
            secretaryData: {
              name: "Jane Smith",
              email: "jane@example.com",
              phone: "923120201710", // Test phone number
            },
            caseNumber: "CASE-2024-001",
            clientName: "Test Client",
            caseDetails: {
              courtName: "Test Court",
              caseType: "Civil",
              priority: "High",
              assignedDate: new Date().toLocaleDateString(),
            },
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert(
          "✅ WhatsApp notifications sent successfully for case assignment!"
        );
        console.log("WhatsApp Response:", result);
      } else {
        alert("❌ Failed to send WhatsApp notifications");
        console.error("Error:", result.message);
      }
    } catch (error) {
      alert("❌ Error testing WhatsApp notifications");
      console.error("Test Error:", error);
    }
  };

  const testHearingSchedule = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/whatsapp/notify/hearing-schedule",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust based on your auth
          },
          credentials: "include",
          body: JSON.stringify({
            caseNumber: "CASE-2024-001",
            hearingDate: "2024-02-15",
            hearingTime: "10:00",
            courtName: "Test Court",
            judge: "Justice Smith",
            clientName: "Test Client",
            lawyersData: [
              {
                name: "John Doe",
                phone: "923120201709",
                email: "john@example.com",
              },
            ],
            secretariesData: [
              {
                name: "Jane Smith",
                phone: "923120201710",
                email: "jane@example.com",
              },
            ],
            caseType: "Civil",
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert("✅ WhatsApp hearing notifications sent successfully!");
        console.log("WhatsApp Response:", result);
      } else {
        alert("❌ Failed to send WhatsApp hearing notifications");
        console.error("Error:", result.message);
      }
    } catch (error) {
      alert("❌ Error testing WhatsApp hearing notifications");
      console.error("Test Error:", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h3 className="text-lg font-bold mb-4 text-gray-800">
        📱 WhatsApp Integration Test
      </h3>

      <div className="space-y-3">
        <button
          onClick={testCaseAssignment}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          🔔 Test Case Assignment Notification
        </button>

        <button
          onClick={testHearingSchedule}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
        >
          📅 Test Hearing Schedule Notification
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-600">
        <p>• Test phone numbers: 923120201709, 923120201710</p>
        <p>• Check browser console for detailed responses</p>
        <p>• Make sure backend server is running</p>
      </div>
    </div>
  );
};

export default WhatsAppTestNotifications;
