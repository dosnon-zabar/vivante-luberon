"use client";

export default function InscriptionForm() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-3"
    >
      <input
        type="text"
        placeholder="Votre nom"
        className="w-full px-3 py-2 rounded-lg border border-argile/30 bg-ivoire text-sm text-brun placeholder:text-brun-light/50 focus:outline-none focus:ring-2 focus:ring-terracotta/30"
      />
      <input
        type="email"
        placeholder="Votre email"
        className="w-full px-3 py-2 rounded-lg border border-argile/30 bg-ivoire text-sm text-brun placeholder:text-brun-light/50 focus:outline-none focus:ring-2 focus:ring-terracotta/30"
      />
      <input
        type="tel"
        placeholder="Téléphone (optionnel)"
        className="w-full px-3 py-2 rounded-lg border border-argile/30 bg-ivoire text-sm text-brun placeholder:text-brun-light/50 focus:outline-none focus:ring-2 focus:ring-terracotta/30"
      />
      <button
        type="submit"
        className="w-full py-2.5 bg-terracotta text-ivoire font-medium rounded-lg hover:bg-terracotta-dark transition-colors text-sm"
      >
        Je m&apos;inscris
      </button>
      <p className="text-[11px] text-brun-light/60 text-center">
        Inscription non fonctionnelle pour le moment
      </p>
    </form>
  );
}
