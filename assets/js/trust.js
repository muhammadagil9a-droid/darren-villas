/* ============================================================
   TRUST — client quotes, licences, company registration.
   ⚠ EVERYTHING BELOW IS SAMPLE (DUMMY) DATA. Replace it with the real
   details before launch, then set  sample: false  so the
   "Sample content" labels disappear.
   ============================================================ */
window.TRUST = {
  sample: true,

  // Company registration, shown in the "Licensed & insured" section and the footer.
  legal: {
    nib: "9120301844712",            // Nomor Induk Berusaha (from OSS)
    npwp: "01.234.567.8-901.000",    // company tax ID
    ahu: "AHU-0012345.AH.01.01.2012",// Ministry of Law registration of the PT
    sbu: "BG001",                    // SBU construction sub-classification (BG001 = residential buildings)
    engineers: 4,                    // number of engineers with SKK certificates
    warrantyStructure: 10,           // years
    warrantyFinish: 12               // months
  },

  // Client quotes. project = id from projects.js (shows that villa's photo and links to it).
  // country = flag code: en (UK), ru, nl, pt (Brazil), id
  testimonials: [
    {
      name: "Alexei K.", country: "ru", project: "coz",
      quote: {
        en: "We built Coz from abroad and never felt far away. Weekly photo reports, a clear budget, and the villa was handed over two weeks early.",
        ru: "Мы строили Coz, находясь за границей, и ни разу не почувствовали себя далеко. Еженедельные фотоотчёты, понятный бюджет — и вилла сдана на две недели раньше срока.",
        nl: "We bouwden Coz vanuit het buitenland en voelden ons nooit ver weg. Elke week fotoverslagen, een helder budget, en de villa werd twee weken eerder opgeleverd.",
        pt: "Construímos a Coz morando no exterior e nunca nos sentimos distantes. Relatórios com fotos toda semana, orçamento claro, e a villa foi entregue duas semanas antes do prazo.",
        id: "Kami membangun Coz dari luar negeri, tapi tidak pernah merasa jauh. Laporan foto setiap minggu, anggaran yang jelas, dan villa diserahkan dua minggu lebih cepat."
      }
    },
    {
      name: "Sanne & Joris V.", country: "nl", project: "nori",
      quote: {
        en: "What stood out was the quality of the finishing. Every detail in timber and stone was exactly as agreed, and they still answer quickly after handover.",
        ru: "Больше всего нас впечатлило качество отделки. Каждая деталь из дерева и камня выполнена точно так, как договаривались, и после сдачи они по-прежнему быстро отвечают.",
        nl: "Wat opviel was de kwaliteit van de afwerking. Elk detail in hout en steen was precies zoals afgesproken, en ook na de oplevering reageren ze snel.",
        pt: "O que mais chamou atenção foi a qualidade do acabamento. Cada detalhe em madeira e pedra ficou exatamente como combinado, e eles continuam respondendo rápido depois da entrega.",
        id: "Yang paling menonjol adalah kualitas finishing-nya. Setiap detail kayu dan batu persis seperti yang disepakati, dan setelah serah terima mereka tetap cepat merespons."
      }
    },
    {
      name: "Mariana C.", country: "pt", project: "mizu",
      quote: {
        en: "Ten villas, one team and one contract. Having the materials and the construction in the same hands saved us months and a lot of stress.",
        ru: "Десять вилл, одна команда и один договор. То, что материалы и строительство были в одних руках, сэкономило нам месяцы и много нервов.",
        nl: "Tien villa's, één team en één contract. Doordat materialen en bouw in dezelfde handen lagen, scheelde dat ons maanden en veel stress.",
        pt: "Dez villas, uma equipe e um contrato. Ter os materiais e a obra nas mesmas mãos nos poupou meses e muito estresse.",
        id: "Sepuluh villa, satu tim, dan satu kontrak. Material dan konstruksi di satu tangan menghemat waktu kami berbulan-bulan dan banyak stres."
      }
    }
  ]
};
