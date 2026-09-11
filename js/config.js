/**
 * MAHALAXMI ENTERPRISES / DHANALAKSHMI PUREIT
 * System Configuration & Default Master Seed Data
 */

const DEFAULT_CONFIG = {
  settings: {
    businessName: "Mahalaxmi Enterprises",
    brandName: "Dhanalakshmi Pureit",
    tagline: "Pure Water. Better Living.",
    phone: "+91 97014 10661",
    phoneClean: "919701410661",
    whatsapp: "919701410661",
    email: "contact@mahalaxmipureit.com",
    address: "Karimnagar, Telangana, India",
    businessHours: "Mon - Sat: 9:00 AM - 8:00 PM | Sun: 10:00 AM - 2:00 PM",
    googleMapsEmbed: "https://www.google.com/maps?q=18.4539876,79.1029154&z=16&output=embed",
    socialLinks: {
      facebook: "https://facebook.com/mahalaxmipureit",
      instagram: "https://instagram.com/mahalaxmipureit",
      youtube: "https://youtube.com/@mahalaxmipureit",
      linkedin: "https://linkedin.com/company/mahalaxmi-enterprises"
    },
    footerDescription: "Mahalaxmi Enterprises (Dhanalakshmi Pureit) provides reliable water purification products, installation support, service assistance, genuine spare parts, and reliable solar energy solutions for homes and businesses.",
    copyrightText: "© 2026 Mahalaxmi Enterprises. All Rights Reserved. Brand Name: Dhanalakshmi Pureit."
  },

  whatsapp: {
    number: "919701410661",
    defaultMessage: "Hello Mahalaxmi Enterprises, I would like to inquire about your water purification and solar solutions.",
    productMessage: "Hello Mahalaxmi Enterprises, I am interested in *{product}* (Model: {model}). Please share specifications, pricing quotation, and installation assistance.",
    cartMessage: "Hello Mahalaxmi Enterprises, I would like to request a quotation for the following items:\n\n{items}\n\n*Customer Details:*\nName: {name}\nPhone: {phone}\nLocation: {location}\nMessage: {message}",
    serviceMessage: "Hello Mahalaxmi Enterprises, I would like to book a service request:\n*Service:* {service}\n*Brand/Model:* {brand} {model}\n*Customer:* {name}\n*Phone:* {phone}\n*Location:* {location}\n*Preferred Date:* {date}\n*Notes:* {message}"
  },

  banners: [
    {
      id: "ban-1",
      heading: "Pure Water. Better Living.",
      subheading: "Smart Water Purification Solutions for Every Family.",
      description: "Provide reliable water purification products, installation support, service assistance and complete water solutions for homes and businesses.",
      button1Text: "Explore Products",
      button1Link: "products.html",
      button2Text: "Get Free Enquiry",
      button2Link: "contact.html",
      image: "assets/hero/hero-purifier.svg",
      badge: "ISO 9001 Certified Quality Components",
      status: "active",
      order: 1
    },
    {
      id: "ban-2",
      heading: "Industrial & Commercial RO Plants",
      subheading: "High-Capacity Reliable Water Treatment Systems",
      description: "Custom engineered 50 LPH to 10,000 LPH RO plants for schools, hospitals, commercial complexes, and food industries.",
      button1Text: "Commercial Solutions",
      button1Link: "products.html?category=Commercial%20RO%20Systems",
      button2Text: "Request Consultation",
      button2Link: "contact.html",
      image: "assets/products/commercial-ro-50lph.svg",
      badge: "Commercial Water Engineering",
      status: "active",
      order: 2
    },
    {
      id: "ban-3",
      heading: "Reliable Energy Solutions for Every Need",
      subheading: "Solar Inverters, Batteries & Solar Rooftops",
      description: "Power your home and water systems with uninterrupted green solar power solutions backed by professional installation.",
      button1Text: "Explore Solar",
      button1Link: "solar.html",
      button2Text: "Get Solar Quote",
      button2Link: "contact.html",
      image: "assets/solar/solar-inverter.svg",
      badge: "Renewable Power Solutions",
      status: "active",
      order: 3
    }
  ],

  categories: [
    { id: "cat-1", name: "RO Water Purifiers", slug: "ro-water-purifiers", description: "Multi-stage Reverse Osmosis purifiers for high TDS borewell water.", status: "active" },
    { id: "cat-2", name: "UV Water Purifiers", slug: "uv-water-purifiers", description: "Ultraviolet disinfection purifiers ideal for low TDS municipal water.", status: "active" },
    { id: "cat-3", name: "UF Water Purifiers", slug: "uf-water-purifiers", description: "Gravity-based and ultrafiltration systems with zero electricity.", status: "active" },
    { id: "cat-4", name: "RO + UV + UF", slug: "ro-uv-uf", description: "Advanced comprehensive multi-stage purification with alkaline & copper.", status: "active" },
    { id: "cat-5", name: "Commercial RO Systems", slug: "commercial-ro-systems", description: "High-capacity water purification plants for institutions and factories.", status: "active" },
    { id: "cat-6", name: "Water Dispensers", slug: "water-dispensers", description: "Hot, cold, and normal water dispensers with built-in cooling.", status: "active" },
    { id: "cat-7", name: "RO Filters", slug: "ro-filters", description: "Sediment, carbon block, RO membranes, and post-carbon filter cartridges.", status: "active" },
    { id: "cat-8", name: "RO Accessories", slug: "ro-accessories", description: "Booster pumps, SMPS adapters, solenoid valves, UV lamps & fittings.", status: "active" },
    { id: "cat-9", name: "Solar Inverters", slug: "solar-inverters", description: "Hybrid and off-grid solar inverters for homes and businesses.", status: "active" },
    { id: "cat-10", name: "Batteries", slug: "batteries", description: "Tubular and lithium-ion batteries engineered for high cyclic solar duty.", status: "active" },
    { id: "cat-11", name: "Solar Solutions", slug: "solar-solutions", description: "Turnkey residential and commercial rooftop solar panel setups.", status: "active" }
  ],

  products: [
    {
      id: "prod-1",
      name: "Dhanalakshmi Pureit Copper+ RO+UV+UF Alkaline",
      brand: "Dhanalakshmi Pureit",
      model: "DP-COPPER-PLUS-2026",
      category: "RO + UV + UF",
      productType: "Domestic RO Purifier",
      purificationTechnology: "RO + UV + UF + Copper Infusion + Alkaline",
      capacity: "10 Litres",
      suitableFor: "Borewell, Tanker, Municipal Water (Up to 2000 ppm TDS)",
      description: "The flagship Dhanalakshmi Pureit Copper+ system combines 7-stage advanced purification with active copper enrichment and alkaline pH balancing. Delivers pure, sweet, and healthy water.",
      features: [
        "7-Stage Advanced Multi-Barrier Purification",
        "Active 99.8% Pure Copper Infusion Chamber",
        "Natural Alkaline Mineralizer maintaining pH 7.5 - 8.5",
        "High-recovery Dow Filmtec equivalent RO membrane",
        "Smart LED alert system for filter replacement and UV status",
        "100% food-grade virgin ABS transparent storage tank"
      ],
      specifications: {
        "Brand": "Dhanalakshmi Pureit",
        "Model": "DP-COPPER-PLUS-2026",
        "Purification Technology": "RO + UV + UF + Copper + Alkaline",
        "Storage Capacity": "10 Litres",
        "Purification Capacity": "15 Litres/Hour",
        "Suitable Water Source": "Borewell, Municipal, Tanker (Up to 2000 TDS)",
        "Installation Type": "Wall Mount / Tabletop",
        "Membrane Type": "75 GPD Thin Film Composite (TFC)",
        "Power Requirement": "24V DC (Adapter input 140-280V AC, 50Hz)",
        "Warranty": "1 Year Comprehensive Warranty on Electricals",
        "Filter Life": "Up to 6000 Litres (approx. 12 months depending on TDS)",
        "Body Material": "Food Grade ABS Plastic"
      },
      warranty: "1 Year Comprehensive Onsite Warranty covering pump and SMPS.",
      installation: "Free standard installation by Mahalaxmi Enterprises technicians within service zones.",
      serviceInfo: "2 Free Periodic Services included in Year 1. Genuine spare replacement guarantee.",
      availability: "In Stock",
      featured: true,
      price: "Enquire for Best Price",
      images: [
        "assets/products/ro-pure-copper.svg",
        "assets/products/ro-pure-copper-side.svg",
        "assets/products/ro-filters-membrane.svg",
        "assets/products/ro-accessories-tap.svg"
      ]
    },
    {
      id: "prod-2",
      name: "Dhanalakshmi Pureit Grand Mineral RO+UV",
      brand: "Dhanalakshmi Pureit",
      model: "DP-GRAND-MIN-08",
      category: "RO Water Purifiers",
      productType: "Domestic RO Purifier",
      purificationTechnology: "RO + UV + TDS Controller",
      capacity: "8.5 Litres",
      suitableFor: "Borewell & Municipal Water (Up to 1500 ppm TDS)",
      description: "Engineered for reliable everyday hydration. Features a multi-stage sediment, activated carbon, RO and UV sterilizer with an adjustable TDS controller to retain essential minerals.",
      features: [
        "Multi-Stage RO + UV disinfection with TDS retention valve",
        "8.5 Litre food-grade transparent water storage",
        "High-pressure booster pump for low input water pressure areas",
        "Auto-fill shut-off sensor preventing water overflow",
        "Compact space-saving wall-mounting design"
      ],
      specifications: {
        "Brand": "Dhanalakshmi Pureit",
        "Model": "DP-GRAND-MIN-08",
        "Purification Technology": "RO + UV + TDS Mineralizer",
        "Storage Capacity": "8.5 Litres",
        "Purification Capacity": "12 - 15 Litres/Hour",
        "Suitable Water Source": "Borewell & Municipal (Up to 1500 TDS)",
        "Installation Type": "Wall Mount",
        "Power Requirement": "24V DC / 36W",
        "Warranty": "1 Year Electrical Components Warranty",
        "Body Material": "Food Grade ABS"
      },
      warranty: "1 Year Electrical Warranty (Pump & Power Supply).",
      installation: "Standard wall installation provided upon delivery.",
      serviceInfo: "Prompt on-call servicing and filter change reminder service.",
      availability: "In Stock",
      featured: true,
      price: "Enquire for Best Price",
      images: [
        "assets/products/ro-alkaline-plus.svg",
        "assets/products/ro-pure-copper.svg",
        "assets/products/ro-filters-membrane.svg",
        "assets/products/ro-accessories-tap.svg"
      ]
    },
    {
      id: "prod-3",
      name: "Dhanalakshmi Pureit Ultra Sleek UV + UF",
      brand: "Dhanalakshmi Pureit",
      model: "DP-UV-UF-07",
      category: "UV Water Purifiers",
      productType: "Domestic UV Purifier",
      purificationTechnology: "UV + UF (Ultrafiltration) + Carbon Block",
      capacity: "7 Litres",
      suitableFor: "Municipal Water & Low TDS Tap Water (TDS < 250 ppm)",
      description: "Designed for water with low dissolved salts (municipal/corporation supply). Utilizes high-intensity 11W Philips UV disinfection combined with an ultrafiltration hollow fibre membrane to eliminate 99.99% bacteria, viruses, and cysts without water wastage.",
      features: [
        "Zero Water Wastage Technology",
        "High-Intensity 11W UV Disinfection Tube",
        "Hollow Fibre UF membrane filtering up to 0.01 micron",
        "Silver-impregnated post carbon cartridge for crisp taste",
        "Energy saving smart standby mode"
      ],
      specifications: {
        "Brand": "Dhanalakshmi Pureit",
        "Model": "DP-UV-UF-07",
        "Purification Technology": "UV + UF + Activated Carbon",
        "Storage Capacity": "7 Litres",
        "Purification Capacity": "60 Litres/Hour (Direct Flow)",
        "Suitable Water Source": "Municipal / Corporation Tap Water (TDS < 250 ppm)",
        "Installation Type": "Wall Mount / Tabletop",
        "Power Requirement": "230V AC, 20W",
        "Warranty": "1 Year Warranty on Electrical UV ballast",
        "Filter Life": "Up to 5000 Litres"
      },
      warranty: "1 Year Warranty on UV Lamp and Electronic Ballast.",
      installation: "Free doorstep installation support.",
      serviceInfo: "Recommended annual lamp & filter renewal service available.",
      availability: "In Stock",
      featured: true,
      price: "Enquire for Best Price",
      images: [
        "assets/products/uv-uf-compact.svg",
        "assets/products/ro-alkaline-plus.svg",
        "assets/products/ro-filters-membrane.svg",
        "assets/products/ro-accessories-tap.svg"
      ]
    },
    {
      id: "prod-4",
      name: "Mahalaxmi Commercial RO Plant 50 LPH",
      brand: "Mahalaxmi Enterprises",
      model: "ME-COMM-50LPH",
      category: "Commercial RO Systems",
      productType: "Commercial RO System",
      purificationTechnology: "Heavy Duty Multi-Stage RO + Dual Membrane",
      capacity: "50 Litres / Hour Continuous Flow",
      suitableFor: "Offices, Schools, Restaurants, Clinics, Hostels (50-100 People)",
      description: "High performance commercial reverse osmosis plant built on a heavy-gauge stainless steel (SS-304) skid. Features dual commercial RO membranes, high-capacity rotary vane pump, sediment and micron filtration.",
      features: [
        "Stainless Steel 304 sturdy skid frame",
        "Dual 150 GPD commercial grade membranes",
        "Brass-headed high-pressure rotary booster pump",
        "Panel mounted flow meters and glycerin-filled pressure gauges",
        "Dry run protection and low/high pressure cut-off switches",
        "Can be connected directly to water coolers or overhead SS storage"
      ],
      specifications: {
        "Brand": "Mahalaxmi Enterprises",
        "Model": "ME-COMM-50LPH",
        "Purification Capacity": "50 Litres/Hour (approx. 1.2 Litres/Minute)",
        "Suitable For": "Offices, Clinics, Small Cafes, Factories (50-100 Persons)",
        "Operating TDS Range": "Up to 2500 ppm",
        "Membrane Type": "2 x 150 GPD TFC Commercial Membranes",
        "Pump": "Commercial 100 psi Booster Pump",
        "Frame Structure": "SS 304 Rust-Proof Skid",
        "Power Input": "220V AC single phase, 120W",
        "Warranty": "1 Year Comprehensive Commercial Warranty"
      },
      warranty: "1 Year Commercial Warranty on pump, SMPS and frame.",
      installation: "Site inspection, plumbing connection, and commissioning included.",
      serviceInfo: "Quarterly preventative maintenance visits and consumable packages available.",
      availability: "In Stock",
      featured: true,
      price: "Enquire for Best Commercial Quote",
      images: [
        "assets/products/commercial-ro-50lph.svg",
        "assets/products/ro-filters-membrane.svg",
        "assets/products/ro-booster-pump.svg",
        "assets/products/ro-accessories-tap.svg"
      ]
    },
    {
      id: "prod-5",
      name: "Mahalaxmi Commercial RO Plant 100 LPH",
      brand: "Mahalaxmi Enterprises",
      model: "ME-COMM-100LPH",
      category: "Commercial RO Systems",
      productType: "Commercial RO System",
      purificationTechnology: "Industrial Multi-Stage RO with Sand & Carbon Pre-treat",
      capacity: "100 Litres / Hour",
      suitableFor: "Hospitals, Colleges, Manufacturing Units, Banquet Halls (100-250 People)",
      description: "Heavy-duty 100 Litres per Hour RO system configured with pre-filtration FRP vessels, multi-port valves, and industrial RO membranes for harsh borewell water conditions.",
      features: [
        "FRP 1054 Media Vessel with activated carbon & multi-grade sand",
        "Industrial 300 GPD high-rejection RO membrane",
        "Vertical high-pressure multistage pump",
        "Digital TDS & flow monitoring display",
        "Integrated CIP (Clean In Place) port for easy descaling"
      ],
      specifications: {
        "Brand": "Mahalaxmi Enterprises",
        "Model": "ME-COMM-100LPH",
        "Purification Capacity": "100 Litres/Hour",
        "Suitable TDS Range": "Up to 3000 ppm",
        "Pre-treatment": "FRP vessel with 5-way multi-port valve",
        "Frame": "Heavy Stainless Steel Skid",
        "Power Requirement": "220V AC, 0.5 HP Motor",
        "Warranty": "1 Year Comprehensive Service Warranty"
      },
      warranty: "1 Year Onsite Warranty with priority service support.",
      installation: "Turnkey plumbing, piping, and testing by expert technicians.",
      serviceInfo: "Comprehensive AMC with membrane cleaning support.",
      availability: "Made to Order",
      featured: false,
      price: "Enquire for Commercial Quote",
      images: [
        "assets/products/commercial-ro-50lph.svg",
        "assets/products/ro-filters-membrane.svg",
        "assets/products/ro-booster-pump.svg",
        "assets/products/ro-accessories-tap.svg"
      ]
    },
    {
      id: "prod-6",
      name: "Dhanalakshmi Hot & Cold Water Dispenser with RO",
      brand: "Dhanalakshmi Pureit",
      model: "DP-DISP-HC-20",
      category: "Water Dispensers",
      productType: "Floor Standing Dispenser",
      purificationTechnology: "Inbuilt 5-Stage RO Purification with Compressor Cooling",
      capacity: "Hot: 2L, Cold: 3.5L, Normal: 6L",
      suitableFor: "Executive Offices, Clinics, Luxury Kitchens",
      description: "Floor-standing water dispenser unit with built-in Reverse Osmosis purification system. Instantly delivers steaming hot water for tea/coffee, chilled water for summer, and room temperature pure water on demand.",
      features: [
        "3 Water Options: Hot (85-95°C), Cold (10-15°C), Normal",
        "Integrated 5-stage RO purifier eliminates external 20L jars",
        "Child safety lock on hot water dispenser tap",
        "High efficiency eco-friendly compressor cooling",
        "Food grade stainless steel hot & cold water internal reservoirs"
      ],
      specifications: {
        "Brand": "Dhanalakshmi Pureit",
        "Model": "DP-DISP-HC-20",
        "Purification": "Inbuilt RO (75 GPD)",
        "Cooling Power": "100W",
        "Heating Power": "500W",
        "Hot Tank Capacity": "2 Litres",
        "Cold Tank Capacity": "3.5 Litres",
        "Warranty": "1 Year on Compressor & RO System"
      },
      warranty: "1 Year Warranty on compressor and electricals.",
      installation: "Standard plumbing and electric plug installation.",
      serviceInfo: "Filter replacement and sanitization services every 6 months.",
      availability: "In Stock",
      featured: true,
      price: "Enquire for Best Price",
      images: [
        "assets/products/water-dispenser.svg",
        "assets/products/ro-pure-copper.svg",
        "assets/products/ro-filters-membrane.svg",
        "assets/products/ro-accessories-tap.svg"
      ]
    },
    {
      id: "prod-7",
      name: "Genuine Dhanalakshmi Pureit Filter Service Kit",
      brand: "Dhanalakshmi Pureit",
      model: "DP-KIT-RO-ALL",
      category: "RO Filters",
      productType: "Filter Cartridge Replacement Kit",
      purificationTechnology: "Sediment + Pre-Carbon + RO Membrane + Post-Carbon",
      capacity: "Suitable for all 10-12L Domestic RO Units",
      suitableFor: "All domestic RO water purifiers",
      description: "Complete annual filter maintenance kit containing high-density 5-micron spun polypropylene sediment filter, 100% coconut shell activated carbon block, 80 GPD certified RO membrane, and taste enhancer post-carbon filter.",
      features: [
        "100% genuine food-grade certified filter media",
        "High iodine value (1100 IV) activated carbon for chlorine & odor removal",
        "80 GPD thin film membrane with 96% salt rejection",
        "Includes standard 1/4 inch push-fit connectors and Teflon tape"
      ],
      specifications: {
        "Brand": "Dhanalakshmi Pureit",
        "Model": "DP-KIT-RO-ALL",
        "Kit Contents": "Spun Pre-filter, Carbon Block, 80 GPD Membrane, Post-Carbon Filter, Spanner",
        "Compatibility": "Universal fitting for Dhanalakshmi Pureit, Kent, Aquaguard, and standard RO purifiers",
        "Lifespan": "Up to 6000 Litres (12 Months)",
        "Pore Size": "0.0001 Micron (RO Membrane)"
      },
      warranty: "6 Months Replacement Guarantee on membrane integrity.",
      installation: "Technician doorstep installation available on request.",
      serviceInfo: "Can be purchased alone or booked with professional service.",
      availability: "In Stock",
      featured: false,
      price: "Enquire for Kit Price",
      images: [
        "assets/products/ro-filters-membrane.svg",
        "assets/products/ro-pure-copper.svg",
        "assets/products/ro-alkaline-plus.svg",
        "assets/products/ro-accessories-tap.svg"
      ]
    },
    {
      id: "prod-8",
      name: "Heavy Duty 100 GPD RO Booster Pump",
      brand: "Mahalaxmi Enterprises",
      model: "ME-PUMP-100GPD",
      category: "RO Accessories",
      productType: "Booster Pump",
      purificationTechnology: "Diaphragm Booster Pump",
      capacity: "Up to 100 GPD RO Systems",
      suitableFor: "Low pressure input water lines",
      description: "Original heavy-duty 24V DC diaphragm booster pump designed to provide consistent high pressure to RO membranes, maximizing pure water recovery and reducing reject water.",
      features: [
        "High pressure output 120-130 PSI",
        "Copper wound heavy motor for continuous operation",
        "Silent vibration-damped rubber mounting brackets",
        "Low power consumption (24V DC / 1.2A)",
        "Overheat thermal protection circuit"
      ],
      specifications: {
        "Brand": "Mahalaxmi Enterprises",
        "Model": "ME-PUMP-100GPD",
        "Voltage": "24V DC",
        "Current": "1.2 Amps",
        "Working Pressure": "80-120 PSI",
        "Duty Cycle": "Continuous",
        "Warranty": "1 Year Replacement Warranty"
      },
      warranty: "1 Year Replacement Warranty against manufacturing defects.",
      installation: "Can be fitted by our technician in 30 minutes.",
      serviceInfo: "Tested and guaranteed compatible with all RO units.",
      availability: "In Stock",
      featured: false,
      price: "Enquire for Best Price",
      images: [
        "assets/products/ro-booster-pump.svg",
        "assets/products/ro-filters-membrane.svg",
        "assets/products/ro-pure-copper.svg",
        "assets/products/ro-accessories-tap.svg"
      ]
    }
  ],

  services: [
    {
      id: "serv-1",
      title: "RO Installation",
      slug: "ro-installation",
      description: "Professional doorstep installation for new and relocated RO, UV, and UF water purifiers. Includes inlet water pressure check, drilling, wall mounting, plumbing connection, and TDS calibration.",
      benefits: [
        "Leak-free precision plumbing fittings",
        "TDS level testing before & after installation",
        "Electrical check for booster pump & adapter",
        "Guidance on daily operation and filter flush"
      ],
      image: "assets/services/installation.svg",
      status: "active"
    },
    {
      id: "serv-2",
      title: "RO Repair",
      slug: "ro-repair",
      description: "Rapid troubleshooting and repair for non-functioning purifiers, foul taste, low flow rate, continuous reject water, or strange pump noises.",
      benefits: [
        "Certified technician diagnosis at doorstep",
        "Accurate component health analysis",
        "100% genuine Dhanalakshmi Pureit replacement parts",
        "Transparent quotation before commencing repair"
      ],
      image: "assets/services/repair.svg",
      status: "active"
    },
    {
      id: "serv-3",
      title: "RO Servicing & Deep Sanitization",
      slug: "ro-servicing",
      description: "Comprehensive periodic service to sanitize water storage tanks, check membrane health, backwash pre-filters, and verify TDS mineral balance.",
      benefits: [
        "Tank antibacterial sanitation",
        "Pipeline flush and sediment removal",
        "Pressure check and membrane rejection test",
        "Extends purifier lifespan by up to 3 years"
      ],
      image: "assets/services/cleaning.svg",
      status: "active"
    },
    {
      id: "serv-4",
      title: "Filter Replacement",
      slug: "filter-replacement",
      description: "Scheduled replacement of sediment filters, carbon filters, post-carbon taste polishers, and reverse osmosis membranes using authentic components.",
      benefits: [
        "Restores original high flow rate and taste",
        "Eliminates chlorine, chemical odor, and fine silt",
        "Authentic membrane replacement with barcode verification",
        "Free TDS and mineral check included"
      ],
      image: "assets/services/maintenance.svg",
      status: "active"
    },
    {
      id: "serv-5",
      title: "Annual Maintenance Contract (AMC)",
      slug: "annual-maintenance",
      description: "Worry-free 365-day protection plans covering periodic filter replacements, unlimited breakdown service calls, and free labour.",
      benefits: [
        "Covers 3-4 routine maintenance visits per year",
        "Includes scheduled filter & membrane changes",
        "Zero labour charges on breakdown visits",
        "Priority 4-hour emergency response time"
      ],
      image: "assets/services/maintenance.svg",
      status: "active"
    },
    {
      id: "serv-6",
      title: "Water Purifier Cleaning & Descaling",
      slug: "water-purifier-cleaning",
      description: "Specialized food-grade descaling service to eliminate hard calcium scale buildup, algae, and biofilm inside tanks and internal tubing.",
      benefits: [
        "Certified non-toxic descaling treatment",
        "Removes hard scale from float valves & taps",
        "Prevents bad odor and microbial growth",
        "Improves taste and flow volume"
      ],
      image: "assets/services/cleaning.svg",
      status: "active"
    },
    {
      id: "serv-7",
      title: "Commercial RO Service & AMC",
      slug: "commercial-ro-service",
      description: "Dedicated commercial water plant engineering support for 25 LPH, 50 LPH, 100 LPH, 250 LPH, and 1000 LPH institutional systems.",
      benefits: [
        "Sand & Carbon media replacement for FRP vessels",
        "Chemical Clean-In-Place (CIP) membrane rejuvenation",
        "High-pressure pump servicing & seal renewal",
        "Scheduled compliance logging for health audits"
      ],
      image: "assets/services/installation.svg",
      status: "active"
    },
    {
      id: "serv-8",
      title: "Spare Parts Assistance",
      slug: "spare-parts-assistance",
      description: "Stockist and distributor of genuine RO spare parts including booster pumps, SMPS adapters, solenoid valves, UV chokes, faucet taps, and tubing.",
      benefits: [
        "Direct manufacturer supply guarantee",
        "Tested for standard 24V/36V electrical compatibility",
        "Same-day dispatch or doorstep delivery",
        "Warranty backed on electrical spares"
      ],
      image: "assets/services/repair.svg",
      status: "active"
    },
    {
      id: "serv-9",
      title: "Water Quality & TDS Consultation",
      slug: "water-quality-consultation",
      description: "Free on-site or sample laboratory testing for Total Dissolved Solids (TDS), pH balance, and hardness to suggest the exact purification method needed.",
      benefits: [
        "Prevents overspending on unnecessary purifiers",
        "Accurate digital TDS meter testing",
        "Customized solution matching your exact water source",
        "Zero-obligation recommendation"
      ],
      image: "assets/services/cleaning.svg",
      status: "active"
    }
  ],

  solar: [
    {
      id: "sol-1",
      name: "Mahalaxmi Smart Solar Hybrid Inverter 3.5kVA",
      category: "Solar Inverters",
      capacity: "3.5 kVA / 48V",
      description: "High-efficiency pure sine wave solar hybrid inverter with MPPT solar charge controller. Intelligently prioritizes solar energy over grid electricity to lower utility bills while keeping water purifiers, lights, fans, and refrigerators running during power cuts.",
      features: [
        "Built-in 98% efficiency MPPT solar charge controller",
        "Dual operational mode: Solar Priority and Grid Priority",
        "LCD display showing solar generation, battery level & load",
        "Cold start capability and smart battery temperature management"
      ],
      specifications: {
        "Capacity": "3500 VA / 48V DC",
        "Solar Panel Support": "Up to 3600 Watts",
        "MPPT Voltage Range": "60V - 145V DC",
        "Efficiency": "> 95%",
        "Waveform": "Pure Sine Wave",
        "Warranty": "2 Years Manufacturer Warranty"
      },
      image: "assets/solar/solar-inverter.svg",
      status: "active"
    },
    {
      id: "sol-2",
      name: "Mahalaxmi Deep Cycle Solar Tubular Battery 200Ah",
      category: "Batteries",
      capacity: "12V / 200Ah C10",
      description: "Engineered specifically for cyclic solar charging and deep discharge conditions. Constructed with heavy-duty spines, high-purity lead alloy, and porous ceramic vent plugs for low maintenance and long life.",
      features: [
        "C10 rated specifically for solar applications",
        "Over 1500 cycles at 80% Depth of Discharge (DoD)",
        "Ultra-low water loss and easy electrolyte level floats",
        "Resistant to high operating ambient temperatures"
      ],
      specifications: {
        "Nominal Voltage": "12 Volts",
        "Capacity @ C10": "200 Ah",
        "Technology": "Tall Tubular Deep Cycle",
        "Container Material": "Shock-proof Polypropylene",
        "Warranty": "60 Months (36 Months Free Replacement + 24 Months Pro-rata)"
      },
      image: "assets/solar/solar-battery.svg",
      status: "active"
    },
    {
      id: "sol-3",
      name: "Turnkey Residential Rooftop Solar 3 kW System",
      category: "Residential Solar",
      capacity: "3 kW On-Grid / Hybrid",
      description: "Complete turnkey residential rooftop solar solution including high-efficiency Mono PERC solar panels, solar inverter, bi-directional net meter coordination, mounting structures, and lightning arrestors.",
      features: [
        "Generates approx. 12-14 units of clean electricity daily",
        "Drastically reduces monthly electricity bills by up to 80%",
        "High-durability anodized aluminum mounting structures",
        "Net metering assistance with local state electricity boards"
      ],
      specifications: {
        "System Size": "3 kW Rooftop",
        "Modules": "Mono PERC Half-Cut 540W Tier-1 Panels",
        "Inverter Type": "On-Grid / Hybrid Grid-Tie Inverter",
        "Roof Space Needed": "Approx. 220 - 250 sq.ft shade-free area",
        "Module Warranty": "25 Years Performance Warranty (80% output)"
      },
      image: "assets/solar/rooftop-solar.svg",
      status: "active"
    },
    {
      id: "sol-4",
      name: "Commercial & Industrial Rooftop Solar (10 kW - 100 kW)",
      category: "Commercial Solar",
      capacity: "10 kW to 100 kW+",
      description: "Engineered solar energy solutions for commercial buildings, factories, schools, and hospitals to power heavy machinery, commercial RO plants, and commercial air conditioning with maximum tax depreciation benefits.",
      features: [
        "Custom shadow analysis and structural CAD design",
        "Tier-1 Bifacial or Mono PERC photovoltaic panels",
        "Centralized inverter monitoring via web and mobile app",
        "Accelerated tax depreciation & green building certification eligibility"
      ],
      specifications: {
        "Capacity Range": "10 kW - 100 kW+",
        "Inverter": "Three-Phase Grid-Tied String Inverter",
        "Monitoring": "Real-time IoT cloud generation dashboard",
        "Structure": "HDG Galvanized High-Wind Resistance Mounting",
        "Warranty": "5 Years System AMC + 25 Years Panel Warranty"
      },
      image: "assets/solar/rooftop-solar.svg",
      status: "active"
    }
  ],

  faqs: [
    {
      id: "faq-1",
      category: "Water Purifiers",
      question: "Which water purifier is suitable for my home?",
      answer: "The right purifier depends primarily on your water source and Total Dissolved Solids (TDS) level. If your TDS is above 300 ppm (common with borewell or tanker water), an RO (Reverse Osmosis) purifier like Dhanalakshmi Pureit Copper+ or Grand Mineral RO is recommended. For municipal tap water with TDS under 250 ppm, a UV+UF purifier is ideal as it eliminates microorganisms with zero water wastage.",
      order: 1,
      status: "active"
    },
    {
      id: "faq-2",
      category: "Technology",
      question: "What is RO purification and how does it work?",
      answer: "Reverse Osmosis (RO) pushes water under pressure through a semi-permeable membrane with microscopic pores of 0.0001 microns. This removes up to 95-99% of dissolved solids, heavy metals (lead, arsenic, mercury), fluorides, pesticides, bacteria, and viruses, leaving behind pure, sweet drinking water.",
      order: 2,
      status: "active"
    },
    {
      id: "faq-3",
      category: "Maintenance",
      question: "How often should RO water purifier filters be replaced?",
      answer: "Under normal household usage: the external sediment pre-filter should be replaced every 3 to 6 months; the carbon block and post-carbon filters should be replaced every 9 to 12 months; and the main RO membrane typically lasts 18 to 24 months depending on incoming water hardness and daily consumption.",
      order: 3,
      status: "active"
    },
    {
      id: "faq-4",
      category: "Services",
      question: "Do you provide installation and on-site servicing?",
      answer: "Yes, absolutely! Mahalaxmi Enterprises provides professional doorstep installation, repair, filter replacement, tank sanitation, and Annual Maintenance Contracts (AMC) across our service zones with experienced technicians.",
      order: 4,
      status: "active"
    },
    {
      id: "faq-5",
      category: "Commercial",
      question: "Do you provide commercial RO solutions for offices and schools?",
      answer: "Yes. We design, supply, install, and service commercial RO plants ranging from 25 LPH, 50 LPH, 100 LPH, up to 10,000 LPH for offices, schools, hostels, hospitals, restaurants, and manufacturing plants.",
      order: 5,
      status: "active"
    },
    {
      id: "faq-6",
      category: "Solar",
      question: "Do you provide solar inverter and rooftop energy solutions?",
      answer: "Yes. Mahalaxmi Enterprises offers solar hybrid inverters, tubular solar batteries, and turnkey rooftop solar system installations for both residential homes and commercial establishments.",
      order: 6,
      status: "active"
    }
  ],

  enquiries: [
    {
      id: "enq-101",
      customerName: "Ramesh Kumar",
      phone: "+91 98765 43210",
      email: "ramesh.k@gmail.com",
      location: "Indiranagar, Bengaluru",
      productName: "Dhanalakshmi Pureit Copper+ RO+UV+UF Alkaline",
      productId: "prod-1",
      message: "Please share quotation and confirm if free installation is available for Indiranagar location.",
      date: "2026-09-08 11:30 AM",
      status: "New"
    },
    {
      id: "enq-102",
      customerName: "Priya Sharma",
      phone: "+91 97412 88990",
      email: "priya.sharma@yahoo.com",
      location: "Whitefield, Bengaluru",
      productName: "Mahalaxmi Commercial RO Plant 50 LPH",
      productId: "prod-4",
      message: "Need commercial RO for our 40-seater clinic. Please call back with details.",
      date: "2026-09-09 03:15 PM",
      status: "Contacted"
    }
  ],

  serviceRequests: [
    {
      id: "srv-201",
      customerName: "Suresh Babu",
      phone: "+91 94480 55667",
      brand: "Dhanalakshmi Pureit",
      model: "DP-GRAND-MIN-08",
      serviceType: "Filter Replacement & Servicing",
      location: "Jayanagar 4th Block, Bengaluru",
      preferredDate: "2026-09-12",
      message: "Water taste has changed and flow has slowed down. Need filter replacement.",
      date: "2026-09-10 09:45 AM",
      status: "Assigned"
    }
  ],

  customers: [
    {
      id: "cust-1",
      name: "Ramesh Kumar",
      phone: "+91 98765 43210",
      email: "ramesh.k@gmail.com",
      location: "Indiranagar, Bengaluru",
      registeredAt: "2026-09-08",
      status: "Active"
    }
  ]
};

// Expose globally for both browser and scripts
if (typeof window !== "undefined") {
  window.DEFAULT_CONFIG = DEFAULT_CONFIG;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = DEFAULT_CONFIG;
}
