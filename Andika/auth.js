// ===============================
// AUTH CONFIG & HELPERS (1 FILE)
// ===============================

// ====== HOST ======
export const HOST = "http://127.0.0.1:8000/api_dika";

// ====== HARDCODE USER (TEST MODE) ======
export const UserME = {
  id: "MND25094311054",
  nama: "Rizky Walangadi",
  jabatan: "ME"
};

export const UserBM = {
  id: "MND22074311001",
  nama: "Djefli Dalita",
  jabatan: "BM"
};

// ====== GET USER FUNCTION ======
export const getUser = (role = null) => {
  const users = {
    ME: UserME,
    BM: UserBM
  };

  // Jika role dikirim → set session
  if (role) {
    const user = users[role] || null;

    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
    }

    return user;
  }

  // Jika tidak ada role → ambil dari session
  const sessionUser = sessionStorage.getItem("user");

  return sessionUser ? JSON.parse(sessionUser) : null;
};