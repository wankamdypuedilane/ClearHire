export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, type } = req.body ?? {};

  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Email invalide." });
  }

  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  const BREVO_LIST_ID = Number(process.env.BREVO_LIST_ID);

  if (!BREVO_API_KEY || !BREVO_LIST_ID) {
    console.error("Missing BREVO_API_KEY or BREVO_LIST_ID");
    return res.status(500).json({ error: "Configuration serveur manquante." });
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        attributes: {
          PROFIL: type === "entreprise" ? "Entreprise" : "Candidat",
        },
        listIds: [BREVO_LIST_ID],
        updateEnabled: false,
      }),
    });

    if (response.status === 201) {
      return res.status(200).json({ success: true });
    }

    const data = await response.json();

    if (data.code === "duplicate_parameter") {
      return res.status(409).json({ error: "Cet email est déjà inscrit." });
    }

    console.error("Brevo error:", data);
    return res
      .status(response.status)
      .json({ error: data.message || "Erreur lors de l'inscription." });
  } catch (err) {
    console.error("Network error:", err);
    return res
      .status(500)
      .json({ error: "Erreur réseau. Réessaie dans un moment." });
  }
}
