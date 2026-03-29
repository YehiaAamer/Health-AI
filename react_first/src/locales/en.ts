const en = {
  home: "Home",

  dashboard: {
    title: "Dashboard",
    welcome: "Welcome back",
    hello: "Hi",
    subtitle: "Your health, powered by AI.",

    mainMenu: "Main Menu",
    search: "Search",
    clearSearch: "Clear search",
    newTest: "Start New Test",
    newCheckup: "New Checkup",
    recentAnalyses: "Recent Analyses",
    previousReports: "Previous Reports",
    bookConsultation: "Book Consultation",
    settings: "Settings",
    riskLow: "Low",
    riskMedium: "Medium",
    riskHigh: "High",
    loading: "Loading data...",
    fetchError: "We couldn't load your previous analyses.",
    dataError: "Error loading data",
    unableToLoadAnalyses: "Unable to load analyses",

    noPreviousAnalyses: "No previous analyses found",
    firstTestNow: "Take your first test now",
    noReportsYet: "No previous reports yet",
    reportCount: "reports",

    averageRisk: "Average Risk",
    latestStatus: "Latest Status",
    savedReports: "Saved Reports",
    lastCheckup: "Last Checkup",

    analysisOverview: "Overview of your latest AI-based analyses",
    weekly: "Weekly",
    monthly: "Monthly",
    latestAnalysisScore: "Latest Analysis Score",
    noData: "No Data",
    progress: "Progress",
    outOf: "of",

    pregnancies: "Pregnancies",
    glucose: "Glucose",
    bloodPressure: "Blood Pressure",
    skinThickness: "Skin Thickness",
    insulin: "Insulin",
    bmi: "BMI",
    age: "Age",
    diabetesPedigree: "Diabetes Pedigree",

    infectionProbability: "Infection probability",
    viewReport: "View Report",
    date: "Date",
    action: "Action",

    healthTipText:
      "Stay hydrated, exercise regularly, and get enough sleep for better health.",

    lastDoctorContact: "Last Doctor Contact",
    lastDoctorContactDesc: "Your most recent consultation appointment",
    doctorCardTitle: "Your Doctor",
    doctorCardText:
      "The last connected doctor will appear here once consultation data becomes available.",
    openConsultations: "Open Consultations"
  },

  report: {
    title: "Preliminary Analysis Report",
    unknown: "Unknown",

    riskHigh: "High Risk",
    riskMedium: "Medium Risk",
    riskLow: "Low Risk",

    diabetesRisk: "Diabetes Risk",
    remaining: "Remaining",
    diabetesRiskProbability: "Diabetes Risk Probability",
    riskLevelLabel: "Risk Level",

    importantWarning: "Important Warning",
    preliminaryResult: "Preliminary Result",

    personalizedRecommendations: "Personalized Recommendations",
    newAnalysis: "New Analysis",
    downloadPdf: "Download Report PDF",

    disclaimerTitle: "Important Disclaimer",
    disclaimerText:
      "This is a preliminary report only and is not a final medical diagnosis. Please consult a specialist doctor for accurate evaluation and additional tests.",

    noResultTitle: "No Analysis Result Found",
    noResultDescription:
      "Please perform the analysis from the diagnosis page first...",
    backToDiagnosis: "Back to Diagnosis",

    noAdditionalMessage: "No additional notes available.",
    pdfError: "Failed to generate PDF. Check console for details.",

    pdf: {
      title: "Diabetes Risk Analysis Report",
      analysisDate: "Analysis Date",
      parameter: "Parameter",
      value: "Value"
    },

    fields: {
      pregnancies: "Pregnancies",
      glucose: "Glucose (mg/dL)",
      bloodPressure: "Blood Pressure (mmHg)",
      skinThickness: "Skin Thickness (mm)",
      insulin: "Insulin (mu U/ml)",
      bmi: "BMI",
      diabetesPedigreeFunction: "Diabetes Pedigree Function",
      age: "Age (years)"
    },

    recommendations: {
      high: {
        1: "Consult an endocrinologist as soon as possible for further testing.",
        2: "Reduce sugars and refined carbohydrates as much as possible.",
        3: "Start light to moderate physical activity every day.",
        4: "Monitor your blood sugar regularly."
      },
      mediumHigh: {
        1: "It is recommended to see a doctor as soon as possible.",
        2: "Follow a low-carb diet plan.",
        3: "Exercise for at least 150 minutes per week.",
        4: "Maintain a healthy and stable weight."
      },
      moderate: {
        1: "Maintain a balanced and healthy lifestyle.",
        2: "Avoid excessive sugar intake.",
        3: "Exercise regularly.",
        4: "Get routine check-ups every 6 to 12 months."
      },
      low: {
        1: "Continue your current healthy lifestyle.",
        2: "Eat vegetables, fruits, and good protein sources regularly.",
        3: "Stay physically active every day.",
        4: "Have a routine check-up every 1 to 2 years."
      }
    }
  },

  forgotPassword: {
    title: "Forgot your password?",
    subtitle:
      "Enter your email address and we’ll send you a password reset link.",
    backToLogin: "Back to Login",
    emailLabel: "Email Address",
    emailPlaceholder: "example@email.com",
    submit: "Send Reset Link",
    sending: "Sending...",
    sentTitle: "Sent Successfully!",
    sentSubtitle:
      "Check your email and click the link to reset your password.",
    successToast:
      "A password reset link has been sent to your email address.",
    errors: {
      sendFailed: "Failed to send the reset email.",
      unexpected: "An error occurred while sending the email. Please try again."
    }
  },

  editProfile: {
    title: "Edit Profile",
    subtitle: "Update your basic personal information.",
    backToDashboard: "Back to Dashboard",

    profileImageAlt: "Profile picture",
    changePhoto: "Change photo",
    removePhoto: "Remove photo",

    firstName: "First Name",
    lastName: "Last Name",
    email: "Email Address",
    phone: "Phone Number (Optional)",

    saveChanges: "Save Changes",
    saving: "Saving...",
    forgotPassword: "Forgot your password?",

    defaultName: "User Name",
    personalInfoSubtitle: "Make sure your details are correct before saving.",

    placeholders: {
      firstName: "Ahmed",
      lastName: "Mohamed",
      email: "ahmed@example.com",
      phone: "+20 123 456 7890"
    },

    toasts: {
      invalidImage: "Please select a valid image file",
      imageTooLarge: "Image size must be less than 5 MB",
      pictureDeleted: "Profile picture deleted successfully",
      deleteFailed: "Failed to delete the profile picture from the server",
      updateSuccess: "Profile updated successfully",
      updateFailed: "Failed to update profile",
      unexpectedError: "An unexpected error occurred"
    }
  },

  reports: "Reports",
  consultations: "Consultations",
  helpNav: "Help",

  help: {
    title: "Help Center",
    subtitle:
      "Find quick answers to common questions or reach out to our support team.",
    searchPlaceholder: "Search your question here...",
    faqs: {
      aiDiagnosis: {
        question: "Is the AI diagnosis a replacement for a doctor?",
        answer:
          "No, HealthAI is a smart tool designed to provide preliminary insights and information based on symptoms, but it does not replace professional medical advice."
      },
      dataSecurity: {
        question: "How secure is my medical data?",
        answer:
          "Your privacy and data security are our top priorities, and your information is handled with strong protection measures."
      },
      resetPassword: {
        question: "How do I reset my password?",
        answer:
          "You can reset your password by clicking on the Forgot Password option and following the instructions."
      },
      downloadReports: {
        question: "Can I download my reports?",
        answer:
          "Yes, you can easily download your health reports in PDF format."
      }
    },
    contact: {
      title: "Still have questions?",
      subtitle: "Our team is here to help you.",
      emailTitle: "Email Support",
      emailDescription: "Get a detailed response within 24 hours."
    },
    importantPages: "Important Pages",
    links: {
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      contact: "Contact Us"
    }
  },

  chatBot: {
    title: "AI Medical Assistant",
    connectedToLastPrediction: "Connected to your latest analysis",
    generalMode: "General mode",
    welcomeWithPrediction:
      "Hello! I’m your AI medical assistant. I have your latest analysis result ({{probability}}% - {{riskLevel}}). How can I help you?",
    welcomeDefault:
      "Hello! I’m your AI medical assistant. Ask me anything about diabetes, analyses, or your general health.",
    welcomeFallback:
      "Hello! I’m your AI medical assistant. How can I help you?",
    typing: "Typing...",
    inputPlaceholder: "Type your question here...",
    disclaimer:
      "This is an AI assistant and does not replace consultation with a medical specialist.",
    fallbackError:
      "Sorry, there is currently a technical issue. Please try again later or consult a doctor.",
    temporarilyDisabled: "(Chatbot is temporarily disabled)",
    unavailableToast: "Chatbot is currently unavailable",
    openAriaLabel: "Open chat assistant",
    minimizeAriaLabel: "Minimize chat",
    closeAriaLabel: "Close chat",
    sendAriaLabel: "Send message"
  },

  faqs: "FAQs",
  contact: "Contact",
  login: "Login",
  getStarted: "Get Started",
  settings: "Settings",
  logout: "Logout",
  myAccount: "My Account",
  contactUs: "Contact Us",
  sendMessage: "Send Message",
  name: "Name",
  email: "Email",
  subject: "Subject",
  message: "Message",

  footer: {
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    contact: "Contact Support",
    copyright: "© 2026 HealthAI. All rights reserved."
  },

  landing: {
    heroTitle: "AI-Powered Medical Diagnosis at Your Fingertips",
    heroSubtitle:
      "Get fast, accurate, and confidential health insights with our AI-driven diagnostic tool.",
    startCheckup: "Start Your Checkup",
    scrollNext: "Scroll to Next Section",

    howItWorksTitle: "How It Works",
    howItWorksSubtitle:
      "A simple, three-step process to get your personalized health report.",
    step1Title: "1. Input Symptoms",
    step1Desc:
      "Describe your symptoms in detail using our intuitive interface.",
    step2Title: "2. AI Analysis",
    step2Desc:
      "Our AI analyzes your input using advanced algorithms and medical data.",
    step3Title: "3. Personalized Report",
    step3Desc:
      "Receive a comprehensive report with insights and recommendations.",

    benefitsTitle: "Key Benefits",
    benefitsSubtitle:
      "Experience the power of AI in healthcare with our advanced features.",
    benefit1Title: "Fast & Accurate Results",
    benefit1Desc: "Get results in minutes with high accuracy.",
    benefit2Title: "Secure & Confidential Data",
    benefit2Desc: "Your data is encrypted and kept private.",
    benefit3Title: "Easy-to-Use Interface",
    benefit3Desc: "Simple and intuitive design for all users.",
    benefit4Title: "Supports Multiple Conditions",
    benefit4Desc: "Diagnose a wide range of health issues.",
    benefit5Title: "24/7 Availability",
    benefit5Desc: "Access our service anytime, anywhere.",
    benefit6Title: "Doctor Verified",
    benefit6Desc: "Information is reviewed by professionals.",

    testimonialsTitle: "What Our Users Say",
    testimonialsSubtitle:
      "Real stories from patients and doctors who trust HealthAI.",
    testimonial1Text:
      '"HealthAI revolutionized my practice. It provides quick and reliable insights, making diagnosis faster for my patients."',
    testimonial1Name: "Dr. Sam Carter",
    testimonial1Role: "General Practitioner",
    testimonial2Text:
      '"I was amazed by the accuracy and speed of the diagnosis. It gave me peace of mind and helped me understand my health better."',
    testimonial2Name: "Mark Thompson",
    testimonial2Role: "Patient",

    ctaTitle: "Take control of your health today.",
    ctaSubtitle:
      "Join thousands of users who are making smarter health decisions with AI-powered insights.",
    ctaButton: "Start Diagnosis Now"
  },

  contactPage: {
    pageTitle: "Contact Us",
    pageSubtitle: "We’re here to help. Feel free to get in touch with us.",
    formTitle: "Send Us a Message",
    formDescription:
      "Fill out the form and we’ll get back to you as soon as possible.",
    name: "Name",
    email: "Email",
    subject: "Subject",
    message: "Message",
    namePlaceholder: "John Smith",
    emailPlaceholder: "example@email.com",
    subjectPlaceholder: "General inquiry",
    messagePlaceholder: "Write your message here...",
    requiredFields: "Please fill in all required fields.",
    invalidEmail: "Please enter a valid email address.",
    successMessage:
      "Your message has been sent successfully! We’ll contact you soon.",
    failedMessage: "Failed to send message. Please try again.",
    sending: "Sending...",
    sendMessage: "Send Message",
    replyTime: "We usually reply within 24 business hours",
    emailTitle: "Email",
    phoneTitle: "Phone",
    addressTitle: "Address",
    addressValue: "Cairo, Egypt",
    faqTitle: "Looking for a quick answer?",
    faqDescription:
      "Browse the help center. You might find your answer there.",
    faqLink: "Go to Help Center",
    support247: "Email support is available 24/7",
    emergencyTitle: "Medical Emergency?",
    emergencyText:
      "If you have a medical emergency, do not wait — call emergency services immediately.",
    emergencyCall: "123 (Ambulance in Egypt)",
    locationTitle: "Our Location",
    locationDescription: "Visit us at our office",
    openMap: "Open Map",
    mapText: "Open the location on Google Maps",
    egypt: "Egypt"
  },

  authPage: {
    secureAccess: "Secure Access",
    loginSubtitle: "Log in to your account",
    signupSubtitle: "Create a new account",
    loginTab: "Login",
    signupTab: "Sign Up",
    email: "Email",
    password: "Password",
    processing: "Processing...",
    loginButton: "Login",
    signupButton: "Create Account",
    noAccount: "Don't have an account?",
    createNow: "Create one now",
    haveAccount: "Already have an account?",
    loginNow: "Log in now",
    firstName: "First Name",
    firstNamePlaceholder: "John",
    lastName: "Last Name",
    lastNamePlaceholder: "Smith",
    confirmPassword: "Confirm Password",
    passwordHint: "Uppercase, lowercase, number, 8+ characters",
    loginSuccess: "Logged in successfully!",
    loginFailed: "Login failed",
    signupSuccess: "Account created successfully!",
    signupFailed: "Account creation failed",
    securityNotice:
      "Secure data: We use encryption to protect your login information",
    footerNote: "This website uses AI for early diabetes detection",
    validation: {
      invalidEmail: "Invalid email address",
      emailRequired: "Email is required",
      passwordRequired: "Password is required",
      firstNameMin: "First name must be at least 2 characters",
      lastNameMin: "Last name must be at least 2 characters",
      passwordMin: "Password must be at least 8 characters",
      passwordUpper: "Must contain an uppercase letter",
      passwordLower: "Must contain a lowercase letter",
      passwordNumber: "Must contain a number",
      confirmPasswordRequired: "Confirm password is required",
      passwordsMismatch: "Passwords do not match"
    }
  },

  pastReportsPage: {
    noReportsToast: "No previous reports found",
    fetchError: "We couldn't load previous reports",
    dataError: "Error loading data",
    mustLogin: "You must log in first to view previous reports",
    title: "Past Reports",
    subtitle: "View all previous diabetes analyses you have completed",
    newTest: "Start New Test",
    loading: "Loading reports...",
    emptyTitle: "No previous reports",
    emptySubtitle: "Start your first diabetes analysis now",
    startAnalysis: "Start Analysis",
    totalReports: "Total Reports",
    latestTest: "Latest Test",
    average: "Average",
    infectionProbability: "Infection Probability",
    date: "Date",
    viewReport: "View Report",
    pregnancies: "Pregnancies",
    glucose: "Glucose",
    bloodPressure: "Blood Pressure",
    bmi: "Body Mass Index",
    riskLow: "Low",
riskMedium: "Medium",
riskHigh: "High",
riskVeryHigh: "Very High",
unknownRisk: "Unknown",
    reportId: "Report ID"
  },

  consultationsPage: {
    title: "Book an Online Consultation",
    subtitle:
      "Connect with certified doctors for expert guidance after your AI health report.",
    illustrationText: "Doctor consultation illustration",
    bookingSection: "Booking Section",
    specialization: "Doctor Specialization",
    timeSlots: "Available Time Slots",
    confirm: "Confirm Appointment",
    upcoming: "Upcoming Appointments",
    joinCall: "Join Call",
    upcomingStatus: "Upcoming",
    cancelledStatus: "Cancelled",
    reschedule: "Reschedule",
    cancel: "Cancel",
    rescheduleTitle: "Reschedule Appointment",
    newDate: "New Date",
    newTime: "New Time",
    selectNewTime: "Select new time",
    save: "Save Changes",
    selectRequired: "Please select all required fields",
    selectValidSpecialization: "Please select a valid specialization",
    slotBooked: "This appointment slot is already booked",
    confirmed: "Appointment confirmed!",
    selectNewDateTime: "Please select the new date and time",
    newSlotBooked: "This new slot is already booked",
    generalPractitioner: "General Practitioner",
    cardiologist: "Cardiologist",
    dermatologist: "Dermatologist",
    neurologist: "Neurologist",
    time1000: "10:00 AM",
    time1100: "11:00 AM",
    time1400: "2:00 PM",
    time1500: "3:00 PM",
    time1600: "4:00 PM"
  },

  diagnosisWizard: {
    backHome: "Back to Home",
    pageTitle: "Early Diabetes Screening",
    pageSubtitle:
      "Enter your core medical data to get an initial risk assessment in seconds.",

    section1: "Basic Information",
    section2: "Vital Indicators",
    section3: "Risk Factors",

    section1Desc: "Core personal information used in the assessment.",
    section2Desc: "Medical measurements related to diabetes risk.",
    section3Desc: "Genetic factors that improve assessment accuracy.",

    howItWorks: "How it works",
    howItWorksDesc:
      "Complete 3 simple steps, then get your result and report instantly.",

    tip1: "Enter accurate values",
    tip2: "Insulin can stay 0 if unavailable",
    tip3: "The report appears right after calculation",

    pregnancies: "Number of Pregnancies",
    pregnanciesDesc: "Enter 0 if there was no pregnancy",
    pregnanciesPlaceholder: "e.g. 0",

    glucose: "Glucose Level (mg/dL)",
    glucoseDesc: "Usually 70-140 after fasting",
    glucosePlaceholder: "e.g. 85",

    bloodPressure: "Blood Pressure (mmHg)",
    bloodPressureDesc: "Systolic pressure",
    bloodPressurePlaceholder: "e.g. 70",

    skinThickness: "Skin Thickness (mm)",
    skinThicknessDesc: "Subcutaneous fat thickness",
    skinThicknessPlaceholder: "e.g. 20",

    insulin: "Insulin Level (mu U/ml)",
    insulinDesc: "0 if not measured",
    insulinPlaceholder: "e.g. 0",

    bmi: "Body Mass Index (BMI)",
    bmiDesc: "Weight in kg ÷ (height in meters)²",
    bmiPlaceholder: "e.g. 25.0",

    pedigree: "Diabetes Pedigree Function",
    pedigreeDesc: "Genetic factor (0.078–2.42)",
    pedigreePlaceholder: "e.g. 0.5",

    age: "Age (Years)",
    ageDesc: "From 21 to 81 years",
    agePlaceholder: "e.g. 35",

    next: "Next",
    previous: "Previous",
    submit: "Calculate Risk Probability",
    loading: "Calculating...",

    footer:
      "This is only an initial assessment and does not replace consulting a specialist doctor.",
    success: " Analysis completed successfully!",
    error: "An error occurred: ",

    validation: {
      pregnanciesMin: "Must be 0 or more",
      pregnanciesMax: "Maximum is 20",

      glucoseMin: "Must be 0 or more",
      glucoseMax: "Maximum is 200 mg/dL",

      bloodPressureMin: "Must be 0 or more",
      bloodPressureMax: "Maximum is 155 mmHg",

      skinThicknessMin: "Must be 0 or more",
      skinThicknessMax: "Maximum is 99 mm",

      insulinMin: "Must be 0 or more",
      insulinMax: "Maximum is 846 mu U/ml",

      bmiMin: "Must be 0 or more",
      bmiMax: "Maximum is 67.1",

      pedigreeMin: "Must be 0.078 or more",
      pedigreeMax: "Maximum is 2.42",

      ageMin: "Must be 21 or more",
      ageMax: "Maximum is 81 years"
    }
  },

  terms: {
    badge: "Terms & Conditions",
    title: "Terms of Service",
    subtitle:
      "Please read these terms carefully before using HealthAI. Your continued use of the platform indicates your acceptance of these terms and conditions.",
    lastUpdatedLabel: "Last updated:",
    contents: "Contents",
    sectionLabel: "Section",
    notice: {
      title: "Important Notice",
      description:
        "By using HealthAI, you agree to these terms. If you do not agree, please do not use the platform."
    },
    sections: {
      acceptance: {
        title: "Acceptance of Terms",
        intro: "By using HealthAI, you:",
        items: [
          "Agree to comply with these terms and conditions",
          "Acknowledge that you have read and understood the Privacy Policy",
          "Commit to using the platform only for its intended purposes",
          "Acknowledge that you are responsible for the accuracy of the information you provide"
        ]
      },
      serviceDescription: {
        title: "Service Description",
        intro: "HealthAI provides the following services:",
        items: [
          "Diabetes risk analysis based on your health data",
          "An AI medical assistant to answer your health-related questions",
          "Storage of your previous analysis history",
          "General health recommendations"
        ],
        note:
          "Note: These services are for informational and educational purposes only and are not a substitute for professional medical advice."
      },
      medicalDisclaimer: {
        title: "Medical Disclaimer",
        warning: " HealthAI does not provide medical diagnosis or treatment!",
        items: [
          "The analyses provided are statistical estimates only",
          "Do not rely on the results for treatment decisions without consulting a doctor",
          "The platform is not liable for any harm resulting from the use of the information",
          "You should consult a qualified physician for any health concern",
          "In medical emergencies, call emergency services immediately (123 in Egypt)"
        ]
      },
      userObligations: {
        title: "Your Responsibilities as a User",
        intro: "When using the platform, you agree to:",
        items: [
          "Provide accurate and truthful information",
          "Not use the platform for unlawful purposes",
          "Not attempt to hack or tamper with the platform",
          "Not impersonate another person",
          "Not use the platform to spread misleading information",
          "Maintain the confidentiality of your account data"
        ]
      },
      intellectualProperty: {
        title: "Intellectual Property",
        intro:
          "All platform content is protected by intellectual property rights:",
        items: [
          "Logos and trade names are owned by HealthAI",
          "Medical content is protected by copyright",
          "Algorithms and models are owned by the platform",
          "Content may not be copied or distributed without permission"
        ]
      },
      serviceModification: {
        title: "Service Modification",
        intro: "We reserve the right to:",
        items: [
          "Modify or discontinue the service in whole or in part",
          "Change available features",
          "Update the medical models in use",
          "Amend these terms at any time"
        ],
        footnote:
          "We will try to notify you in advance of important changes whenever possible."
      },
      accountTermination: {
        title: "Account Termination",
        intro:
          "We may suspend or terminate your account in the following cases:",
        items: [
          "Violation of these terms and conditions",
          "Unlawful use of the platform",
          "Your request to delete your account",
          "Permanent discontinuation of the service"
        ]
      },
      governingLaw: {
        title: "Governing Law",
        intro: "These terms are governed by:",
        items: [
          "The laws of the Arab Republic of Egypt",
          "Any dispute shall be resolved in the competent courts",
          "If any provision conflicts with the law, that provision shall be deemed invalid while the remaining provisions remain in effect"
        ]
      }
    },
    contact: {
      title: "Have Questions?",
      description:
        "If you have any questions about the Terms of Service, please contact us."
    }
  },

  privacy: {
    title: "Privacy Policy",
    subtitle:
      "Please review how HealthAI collects, uses, stores, and protects your information when you use the platform.",
    lastUpdatedLabel: "Last updated:",
    sectionLabel: "Section",
    sections: {
      collectedInformation: {
        title: "Information We Collect",
        intro: "We collect the following information to provide our services:",
        items: [
          "Personal information: name, email address, age",
          "Medical data: analysis results and health measurements such as glucose, blood pressure, and BMI",
          "Usage data: how you interact with the platform",
          "Chat history: questions submitted to the AI medical assistant"
        ]
      },
      howWeUseInformation: {
        title: "How We Use Your Information",
        intro: "We use your information for the following purposes:",
        items: [
          "Provide accurate and personalized health analysis",
          "Improve service quality and performance",
          "Enable the AI medical assistant to respond to your questions",
          "Store previous analysis history for future reference",
          "Send important health-related alerts if you choose to receive them"
        ]
      },
      dataProtection: {
        title: "Data Protection",
        intro: "We apply strict security measures to protect your data:",
        items: [
          "Encryption of sensitive medical data",
          "Storage on secure servers",
          "Restricted access for authorized personnel only",
          "Regular data backups",
          "Ongoing review of security procedures"
        ]
      },
      informationSharing: {
        title: "Information Sharing",
        strong:
          "We do not sell or rent your personal information to third parties.",
        intro: "Your information may only be shared in the following cases:",
        items: [
          "With your explicit consent",
          "With service providers acting on our behalf under confidentiality obligations",
          "When required by law or court order",
          "To protect your safety or the safety of others"
        ]
      },
      yourRights: {
        title: "Your Rights",
        intro: "You have the following rights regarding your data:",
        items: [
          "Access your personal data",
          "Correct inaccurate information",
          "Delete your account and data, noting this may affect service availability",
          "Export your data in a readable format",
          "Withdraw consent to data processing"
        ]
      },
      medicalDisclaimer: {
        title: "Medical Disclaimer",
        strong:
          "Important: HealthAI is a support tool and does not replace professional medical advice.",
        items: [
          "The information provided is for informational purposes only",
          "It does not constitute a final medical diagnosis",
          "A qualified physician should be consulted for diagnosis and treatment",
          "Do not disregard professional medical advice based on platform information"
        ]
      },
      policyChanges: {
        title: "Changes to This Policy",
        intro:
          "We may update this Privacy Policy from time to time. Important changes may be communicated through:",
        items: [
          "Publishing the updated policy on the platform",
          "Sending an email if the changes are material",
          "Updating the “Last updated” date at the top of the page"
        ]
      }
    },
    contact: {
      title: "Have questions?",
      description:
        "If you have any questions about this Privacy Policy, please contact us."
    }
  }
};

export default en;