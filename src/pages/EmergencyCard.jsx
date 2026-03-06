import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

export default function EmergencyCard() {
  const { userId } = useParams();
  const [data, setData] = useState(null);
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase
        .from("users")
        .select("name, blood_type, medical_notes")
        .eq("id", userId)
        .maybeSingle();

      const { data: contactData } = await supabase
        .from("trusted_contacts")
        .select("contact_name, contact_phone, contact_email")
        .eq("user_id", userId)
        .limit(1)
        .maybeSingle();

      setData(userData);
      setContact(contactData);
      setLoading(false);
    }
    load();
  }, [userId]);

  const bloodTypeColor = {
    "O−": "#ef4444", "O+": "#f97316",
    "A+": "#3b82f6", "A−": "#6366f1",
    "B+": "#a855f7", "B−": "#ec4899",
    "AB+": "#06b6d4", "AB−": "#14b8a6",
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)", fontFamily: "monospace", letterSpacing: "2px" }}>
      LOADING EMERGENCY CARD...
    </div>
  );

  if (!data) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", color: "#f87171", fontFamily: "monospace", letterSpacing: "2px" }}>
      CARD NOT FOUND
    </div>
  );

  const btColor = bloodTypeColor[data.blood_type] || "#6366f1";

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px",
      fontFamily: "'Cormorant Garamond', Georgia, serif",
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{
            fontSize: "11px", color: "rgba(255,255,255,0.3)",
            letterSpacing: "3px", fontFamily: "monospace",
            textTransform: "uppercase", marginBottom: "8px",
          }}>
            🚨 EMERGENCY MEDICAL ID
          </div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", fontFamily: "monospace" }}>
            SmartStreet · Scanned by first responder
          </div>
        </div>

        {/* Blood type — big prominent */}
        <div style={{
          background: `linear-gradient(135deg, ${btColor}22, ${btColor}11)`,
          border: `1px solid ${btColor}55`,
          borderRadius: "20px",
          padding: "28px",
          textAlign: "center",
          marginBottom: "16px",
          boxShadow: `0 0 40px ${btColor}22`,
        }}>
          <div style={{ fontSize: "11px", color: `${btColor}99`, letterSpacing: "2px", fontFamily: "monospace", textTransform: "uppercase", marginBottom: "8px" }}>
            Blood Type
          </div>
          <div style={{
            fontSize: "72px", fontWeight: "300", color: btColor,
            lineHeight: 1, textShadow: `0 0 30px ${btColor}`,
          }}>
            {data.blood_type || "?"}
          </div>
        </div>

        {/* Name */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px", padding: "20px 24px",
          marginBottom: "12px",
        }}>
          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", letterSpacing: "1.5px", fontFamily: "monospace", textTransform: "uppercase", marginBottom: "6px" }}>Patient</div>
          <div style={{ fontSize: "28px", fontWeight: "300", color: "#fff" }}>{data.name}</div>
        </div>

        {/* Medical notes */}
        {data.medical_notes && (
          <div style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: "16px", padding: "20px 24px",
            marginBottom: "12px",
          }}>
            <div style={{ fontSize: "10px", color: "rgba(239,68,68,0.7)", letterSpacing: "1.5px", fontFamily: "monospace", textTransform: "uppercase", marginBottom: "6px" }}>
              ⚠ Medical Notes
            </div>
            <div style={{ fontSize: "16px", fontWeight: "300", color: "#fca5a5", lineHeight: 1.5 }}>
              {data.medical_notes}
            </div>
          </div>
        )}

        {/* Emergency contact */}
        {contact && (
          <div style={{
            background: "rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.25)",
            borderRadius: "16px", padding: "20px 24px",
            marginBottom: "16px",
          }}>
            <div style={{ fontSize: "10px", color: "rgba(99,102,241,0.7)", letterSpacing: "1.5px", fontFamily: "monospace", textTransform: "uppercase", marginBottom: "12px" }}>
              Emergency Contact
            </div>
            <div style={{ fontSize: "20px", fontWeight: "300", marginBottom: "8px" }}>{contact.contact_name}</div>
            <a href={`tel:${contact.contact_phone}`} style={{
              display: "block", fontSize: "18px",
              color: "#818cf8", textDecoration: "none",
              marginBottom: contact.contact_email ? "6px" : 0,
            }}>
              📞 {contact.contact_phone}
            </a>
            {contact.contact_email && (
              <a href={`mailto:${contact.contact_email}`} style={{
                display: "block", fontSize: "14px",
                color: "rgba(129,140,248,0.6)", textDecoration: "none",
              }}>
                ✉ {contact.contact_email}
              </a>
            )}
          </div>
        )}

        {/* Notify blood bank button */}
        <button
          onClick={() => setNotified(true)}
          disabled={notified}
          style={{
            width: "100%", padding: "16px",
            background: notified ? "rgba(239,68,68,0.15)" : "#ef4444",
            color: notified ? "#f87171" : "#fff",
            border: notified ? "1px solid rgba(239,68,68,0.3)" : "none",
            borderRadius: "10px", fontSize: "15px",
            fontFamily: "inherit", fontWeight: "300",
            cursor: notified ? "default" : "pointer",
            letterSpacing: "1px",
            boxShadow: notified ? "none" : "0 4px 20px rgba(239,68,68,0.3)",
            transition: "all 0.3s",
          }}
        >
          {notified ? "✓ Blood Bank Notified" : "🩸 Notify Blood Bank"}
        </button>

      </div>
    </div>
  );
}