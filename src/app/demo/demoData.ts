import { IconAudios, IconNews, IconQuickReads, IconShortClips, IconVideos, IconYogas } from "@/icons";
import { InboxItem } from "@/serverActions/crudInboxItem";
import { Webinar } from "@/serverActions/crudWebinars";


export const inboxMockData: InboxItem[] = [
  {
    id: "msg_001",
    user_id: "user_123",
    title: "Welcome to the platform!",
    body: "Thanks for signing up. We're glad to have you here.",
    item_type: "system_message",
    status: "unread",
    created_at: "2025-01-10T09:00:00.000Z",
    updated_at: "2025-01-10T09:00:00.000Z",
    delivered_at: "2025-01-10T09:00:00.000Z"
  },
  {
    id: "msg_002",
    user_id: "user_123",
    title: "Your appointment is confirmed",
    body: "Your session with Dr. Smith is scheduled for February 1 at 10:00am.",
    item_type: "appointment",
    status: "read",
    created_at: "2025-01-15T14:30:00.000Z",
    updated_at: "2025-01-16T10:00:00.000Z",
    delivered_at: "2025-01-15T14:30:00.000Z",
    read_at: "2025-01-16T10:00:00.000Z",
    url: "https://app.example.com/appointments/123"
  },
  {
    id: "msg_003",
    user_id: "user_123",
    title: "Daily reminder",
    body: "Don't forget to complete your daily check-in.",
    item_type: "reminder",
    status: "unread",
    created_at: "2025-01-20T07:00:00.000Z",
    updated_at: "2025-01-20T07:00:00.000Z"
  },
  {
    id: "msg_004",
    user_id: "user_456",
    title: "System maintenance tonight",
    body: "We will be performing maintenance from 12am to 2am.",
    item_type: "system_alert",
    status: "archived",
    created_at: "2025-01-05T12:00:00.000Z",
    updated_at: "2025-01-06T09:00:00.000Z",
    delivered_at: "2025-01-05T12:00:00.000Z"
  },
  {
    id: "msg_005",
    user_id: "user_123",
    title: "New message received",
    body: "You have a new message regarding your recent appointment.",
    item_type: "push",
    status: "deleted",
    created_at: "2025-01-22T13:10:00.000Z",
    updated_at: "2025-01-23T09:00:00.000Z",
    delivered_at: "2025-01-22T13:10:00.000Z"
  },
  {
    id: "msg_006",
    user_id: "user_456",
    title: "Account updated",
    body: "Your account settings were successfully updated.",
    item_type: "system_message",
    status: "read",
    created_at: "2025-01-12T08:15:00.000Z",
    updated_at: "2025-01-12T09:00:00.000Z",
    read_at: "2025-01-12T09:00:00.000Z",
    delivered_at: "2025-01-12T08:15:00.000Z"
  },
  {
    id: "msg_007",
    user_id: "user_123",
    title: "Payment Reminder",
    body: "Your subscription payment is due on Feb 5.",
    item_type: "reminder",
    status: "unread",
    created_at: "2025-01-25T11:00:00.000Z",
    updated_at: "2025-01-25T11:00:00.000Z"
  },
  {
    id: "msg_008",
    user_id: "user_789",
    title: "New Feature Announcement",
    body: "We just added dark mode! Check it out in your settings.",
    item_type: "system_message",
    status: "unread",
    created_at: "2025-01-18T10:30:00.000Z",
    updated_at: "2025-01-18T10:30:00.000Z",
    delivered_at: "2025-01-18T10:30:00.000Z"
  },
  {
    id: "msg_009",
    user_id: "user_123",
    title: "Appointment cancelled",
    body: "Your session on February 1 has been cancelled by the clinic.",
    item_type: "appointment",
    status: "read",
    created_at: "2025-01-26T16:45:00.000Z",
    updated_at: "2025-01-27T08:00:00.000Z",
    delivered_at: "2025-01-26T16:45:00.000Z",
    read_at: "2025-01-27T08:00:00.000Z"
  },
  {
    id: "msg_010",
    user_id: "user_456",
    title: "Security Alert",
    body: "We detected a login from a new device. If this wasn't you, please secure your account.",
    item_type: "system_alert",
    status: "unread",
    created_at: "2025-01-28T06:20:00.000Z",
    updated_at: "2025-01-28T06:20:00.000Z",
    delivered_at: "2025-01-28T06:20:00.000Z"
  }
];


export const webinarsData: Webinar[] = [
  {
    id: "7WkBEQxkp8",
    title: "Breaking the Stigma: Understanding Mental Health",
    slug: "",
    author: "Dr. Sarah Johnson",
    tags: "Mental Health",
    video: "/assets/videos/webinar1.mp4",
    thumbnail: "/assets/images/webinar.jpg",
    duration_hours: 0,
    duration_minutes: 0,
    description:
      "An engaging talk focused on reducing stigma around mental health and promoting open conversations.",
      updated_at: "",
      created_at: "",
  },
  {
    id: "5f12muiL8h",
    title: "Cognitive Behavioral Therapy Explained",
    slug: "",
    author: "Prof. James Lee",
    tags: "Therapy",
    video: "/assets/videos/webinar2.mp4",
    thumbnail: "/assets/images/webinar.jpg",
    duration_hours: 0,
    duration_minutes: 0,
    description:
      "Learn the basics of CBT and how it can be applied to treat common psychological issues.",
    updated_at: "",
      created_at: "",
    },
  {
    id: "wCiLvHDjmY",
    title: "Workplace Wellness Strategies",
    slug: "",
    author: "Emily Carter",
    tags: "Workplace",
    video: "/assets/videos/webinar3.mp4",
    thumbnail: "/assets/images/webinar.jpg",
    duration_hours: 0,
    duration_minutes: 0,
    description:
      "Practical approaches for fostering well-being and productivity in professional environments.",
    updated_at: "",
      created_at: "",
    },
  {
    id: "LsUN7u1c0j",
    title: "Parenting in the Digital Age",
    slug: "",
    author: "Michael Thompson",
    tags: "Family",
    video: "/assets/videos/webinar4.mp4",
    thumbnail: "/assets/images/webinar.jpg",
    duration_hours: 0,
    duration_minutes: 0,
    description:
      "A guide for parents to support their children in balancing technology use and healthy habits.",
    updated_at: "",
      created_at: "",
    },
  {
    id: "pQl97z4Kf9",
    title: "Mindfulness for Stress Reduction",
    slug: "",
    author: "Dr. Anna Patel",
    tags: "Mindfulness",
    video: "/assets/videos/webinar5.mp4",
    thumbnail: "/assets/images/webinar.jpg",
    duration_hours: 0,
    duration_minutes: 0,
    description:
      "Discover practical mindfulness techniques to reduce stress and improve emotional well-being.",
    updated_at: "",
      created_at: "",
    },
  {
    id: "jIqBUQHlp5",
    title: "Nutrition and Mental Health",
    slug: "",
    author: "David Kim, RDN",
    tags: "Health",
    video: "/assets/videos/webinar6.mp4",
    thumbnail: "/assets/images/webinar.jpg",
    duration_hours: 0,
    duration_minutes: 0,
    description:
      "Explore the connection between diet and mental wellness, with evidence-based nutrition tips.",
    updated_at: "",
      created_at: "",
    },
  {
    id: "D3l69bD53s",
    title: "Supporting Adolescents Through Change",
    slug: "",
    author: "Laura Garcia",
    tags: "Adolescents",
    video: "/assets/videos/webinar7.mp4",
    thumbnail: "/assets/images/webinar.jpg",
    duration_hours: 0,
    duration_minutes: 0,
    description:
      "Insights into adolescent psychology and strategies for guiding teens through transitions.",
    updated_at: "",
      created_at: "",
    },
  {
    id: "gqAq30XhpA",
    title: "The Future of Teletherapy",
    slug: "",
    author: "Dr. Robert Wilson",
    tags: "Technology",
    video: "/assets/videos/webinar8.mp4",
    thumbnail: "/assets/images/webinar.jpg",
    duration_hours: 0,
    duration_minutes: 0,
    description:
      "An overview of how teletherapy is shaping the future of mental health services.",
    updated_at: "",
      created_at: "",
    },
  {
    id: "7p2v1Ur_OE",
    title: "Building Resilience in Challenging Times",
    slug: "",
    author: "Sophia Martinez",
    tags: "Resilience",
    video: "/assets/videos/webinar9.mp4",
    thumbnail: "/assets/images/webinar.jpg",
    duration_hours: 0,
    duration_minutes: 0,
    description:
      "Tools and strategies to develop resilience and adaptability in uncertain situations.",
    updated_at: "",
      created_at: "",
    },
]

  

  export const mentalHealthData = [
    {
      title: "Counseling & Therapy Services",
      image: "/assets/images/img2.jpg",
      duration: "1-2 Hours",
      list: [
        "One-on-one counseling (in-person or virtual)",
        "Teletherapy platforms (e.g., BetterHelp, Headspace Care, MindNation)",
        "Specialist referrals (psychiatrists, psychologists)",
      ],
    },
    {
      title: "Crisis Support",
      image: "/assets/images/img1.jpg",
      duration: "1-2 Hours",
      list: [
          "42/7 confidential helpline",
          "On-demand mental health first aid",
          "Emergency mental health intervention"
        ]
        ,
    },
    {
      title: "Crisis Support",
      image: "/assets/images/img1.jpg",
      duration: "1-2 Hours",
      list: [
          "42/7 confidential helpline",
          "On-demand mental health first aid",
          "Emergency mental health intervention"
        ]
        ,
    },
    {
      title: "Crisis Support",
      image: "/assets/images/img1.jpg",
      duration: "1-2 Hours",
      list: [
          "42/7 confidential helpline",
          "On-demand mental health first aid",
          "Emergency mental health intervention"
        ]
        ,
    },
    {
      title: "Crisis Support",
      image: "/assets/images/img1.jpg",
      duration: "1-2 Hours",
      list: [
          "42/7 confidential helpline",
          "On-demand mental health first aid",
          "Emergency mental health intervention"
        ]
        ,
    },
  ];
  export const alliedHealthData = [
    {
      title: "Counseling & Therapy Services",
      image: "/assets/images/img2.jpg",
      duration: "1-2 Hours",
      list: [
        "One-on-one counseling (in-person or virtual)",
        "Teletherapy platforms (e.g., BetterHelp, Headspace Care, MindNation)",
        "Specialist referrals (psychiatrists, psychologists)",
      ],
    },
    {
      title: "Crisis Support",
      image: "/assets/images/img1.jpg",
      duration: "1-2 Hours",
      list: [
          "42/7 confidential helpline",
          "On-demand mental health first aid",
          "Emergency mental health intervention"
        ]
        ,
    },
    {
      title: "Crisis Support",
      image: "/assets/images/img1.jpg",
      duration: "1-2 Hours",
      list: [
          "42/7 confidential helpline",
          "On-demand mental health first aid",
          "Emergency mental health intervention"
        ]
        ,
    },
    {
      title: "Crisis Support",
      image: "/assets/images/img1.jpg",
      duration: "1-2 Hours",
      list: [
          "42/7 confidential helpline",
          "On-demand mental health first aid",
          "Emergency mental health intervention"
        ]
        ,
    },
    {
      title: "Crisis Support",
      image: "/assets/images/img1.jpg",
      duration: "1-2 Hours",
      list: [
          "42/7 confidential helpline",
          "On-demand mental health first aid",
          "Emergency mental health intervention"
        ]
        ,
    },
  ];
  

  export const practionersData = [
    {
        "id": "7WkBEQxkp8",
        "name": "Naomee Golluccio",
        "position": "PSYCHOLOGIST",
        "experience": "5 years",
        "image": "https://images.squarespace-cdn.com/content/v1/6761fb2601d29e0694e0ad44/10f744dc-ddf1-40d6-96d8-16c51833733f/Untitled+%28800+x+600+px%29+%2812%29.jpg?format=2500w",
        "description": `
  <p>
    Naomee is a registered general psychologist with several years of experience working across a variety of settings, including private practice, forensic environments, and multidisciplinary teams. She is currently completing further postgraduate studies in clinical psychology to enhance her capacity to support clients with more complex and diverse needs.
  </p>
  <p>
    Her current focus is on supporting children, adolescents, and their families. She is passionate about taking a strengths-based approach that focuses on helping young people build resilience, improve emotional regulation, and develop the skills they need to navigate challenges with confidence. She supports clients with a range of concerns, including anxiety, behavioural difficulties, and social skill development, and works collaboratively with families, schools, and other systems to promote consistency and positive change.
  </p>
  <p>
    Her practice is grounded in a client-centred philosophy, where therapy is tailored to the goals, values, and developmental stage of each individual. She draws from a range of evidence-based therapeutic models, including Cognitive Behavioural Therapy (CBT), Acceptance and Commitment Therapy (ACT), and Schema Therapy, all while grounded in a trauma informed approach. Her aim is to create a warm and supportive space where clients feel heard, empowered, and equipped with practical tools for long-term wellbeing.
  </p>
  <p>
    Naomee is currently completing a Master of Clinical Psychology (Post Registration) to obtain clinical endorsement with the Psychology Board of Australia.
  </p>
`,
        "booking_link": ""
    },
    {
        "id": "5f12muiL8h",
        "name": "Johanna Greville",
        "position": "SOCIAL WORKER & KINESIOLOGIST",
        "experience": "8 years",
        "image": "https://images.squarespace-cdn.com/content/v1/6761fb2601d29e0694e0ad44/4f0e874a-4f17-4adc-82ae-4227cac54784/Untitled+%28800+x+600+px%29+%286%29.jpg?format=2500w",
        "description": `<p>
    Johanna is a qualified and registered Social Worker with the Australian Association of Social Workers, as well as a trained Kinesiologist, who specialises in working with neurodiverse children and their families. With extensive experience in both therapeutic and behavioural support, Johanna is passionate about creating inclusive, supportive environments where neurodivergent children feel safe, understood, and empowered.
  </p>
  <p>
    She has worked across a range of settings, supporting children with autism, ADHD, and other neurodevelopmental differences, and brings a strong understanding of the unique challenges they may face. Using practical, strength-based strategies, Johanna helps families build connection, improve regulation, and support emotional development in a way that honours each child’s individual needs.
  </p>
  <p>
    Her holistic, trauma-informed approach integrates nervous system regulation, behavioural insight, and kinesiology to support both emotional and physical wellbeing. Johanna’s warm, grounded presence helps children and families feel seen and supported at every stage of their journey.
  </p>
  <p>
    <strong>Appropriate referrals include:</strong> Anxiety, depression, stress, trauma, behavioural challenges, family violence, and neurodiversity (including autism and ADHD).
  </p>`,
        "booking_link": ""
    },
    {
        "id": "wCiLvHDjmY",
        "name": "Chelsea Huynh",
        "position": "PROVISIONAL PSYCHOLOGIST",
        "experience": "13 years",
        "image": "https://images.squarespace-cdn.com/content/v1/6761fb2601d29e0694e0ad44/bbadedc7-ff67-4cf8-b9dc-3da111c565dc/Chelsea+Huynh?format=2500w",
        "description": ` <p>
    Chelsea is a provisional psychologist with experience supporting clients across a wide age range, from primary school-aged children to mature adults. She is adaptable and culturally sensitive, ensuring her approach is tailored to meet the diverse needs and presentations of her clients.
  </p>
  <p>
    Chelsea specialises in working with children experiencing challenges such as emotional regulation difficulties, anxiety, attention-deficit/hyperactivity disorder (ADHD), autism spectrum disorder (ASD), family relationship issues, and trauma. Additionally, she supports adults navigating concerns like anxiety, depression, trauma, life transitions, and interpersonal difficulties.
  </p>
  <p>
    Chelsea is deeply committed to improving access to mental health services and values working with a diverse client base to increase awareness of the support available. Her friendly and compassionate demeanour fosters a safe and welcoming environment where clients feel comfortable discussing their mental health and working toward enhanced well-being.
  </p>
  <p>
    <strong>Appropriate referrals include:</strong> Concerns related to emotional regulation, anxiety, ADHD, ASD, family relationship issues, trauma, depression, life transitions, and interpersonal challenges.
  </p>`,
        "booking_link": ""
    },
    {
        "id": "LsUN7u1c0j",
        "name": "Yvie Montfort",
        "position": "SOCIAL WORKER",
        "experience": "5 years",
        "image": "https://images.squarespace-cdn.com/content/v1/6761fb2601d29e0694e0ad44/03205627-2b1a-4aa8-8b66-9574fb963b54/Yvie+Montfort?format=2500w",
        "description": `  <p>Yvie is a skilled social worker providing comprehensive therapeutic services to individuals seeking enhanced well-being. Her practice is informed by extensive experience within diverse community settings. She utilises a holistic approach that is grounded in systems theory, which allows her to work with individuals and understand the many interconnected systems that influence their lives.
 </p>
  <p>Yvie's clinical approach is firmly established in trauma-informed principles and integrates therapeutic modalities and theories, including Internal Family Systems (IFS) Therapy, Narrative Therapy, and Polyvagal Theory. This synthesis facilitates a nuanced exploration of internal systems, empowers clients to reconstruct their personal narratives, and promotes effective nervous system regulation.
 </p>
  <p>Yvie’s goal is to create a safe and supportive space where individuals can connect with their authentic selves, release old patterns, and build a more fulfilling life. She has a core belief that everyone has the capacity for healing and growth. 
 </p>
  <p><strong>Appropriate referrals include:</strong></p>
<p>
Anxiety, depression, stress, trauma, pregnancy and parenthood, interpersonal relationship difficulties, life transitions.
</p>`,
        "booking_link": ""
    },
    {
        "id": "pQl97z4Kf9",
        "name": "Lucas",
        "position": "Junior Psychologist",
        "experience": "15 years",
        "image": "/assets/images/img3.png",
        "description": "Passionate about mental wellness and helping others thrive.",
        "booking_link": ""
    },
    {
        "id": "jIqBUQHlp5",
        "name": "Lucas",
        "position": "Senior Psychologist",
        "experience": "5 years",
        "image": "/assets/images/img3.png",
        "description": "Specializes in anxiety and mood disorders.",
        "booking_link": ""
    },
    {
        "id": "D3l69bD53s",
        "name": "Mason",
        "position": "Junior Psychologist",
        "experience": "13 years",
        "image": "/assets/images/img3.png",
        "description": "Focused on holistic and evidence-based treatments.",
        "booking_link": ""
    },
    {
        "id": "gqAq30XhpA",
        "name": "Lucas",
        "position": "Senior Psychologist",
        "experience": "5 years",
        "image": "/assets/images/img3.png",
        "description": "Specializes in anxiety and mood disorders.",
        "booking_link": ""
    },
    {
        "id": "7p2v1Ur_OE",
        "name": "Olivia",
        "position": "Senior Counselor",
        "experience": "15 years",
        "image": "/assets/images/img3.png",
        "description": "Focused on holistic and evidence-based treatments.",
        "booking_link": ""
    }
  ]


  export type Categories = {
    id: string;
    label: string;
    type: string;
    created_at: string;
    icon?: React.ReactNode | string
  }
  export const categories = [
  {
    id: "7p2v1Ur_O1",
    label: "video",
    type: "post",
    created_at: "",
    icon: IconVideos,
  },
  {
    id: "7p2v1Ur_O2",
    label: "audio",
    type: "post",
    created_at: "",
    icon: IconAudios,
  },
  {
    id: "7p2v1Ur_O3",
    label: "short clips",
    type: "post",
    created_at: "",
    icon: IconShortClips,
  },
  {
    id: "7p2v1Ur_O4",
    label: "allied health news",
    type: "post",
    created_at: "",
    icon: IconNews,
  },
  {
    id: "7p2v1Ur_O5",
    label: "yoga and pilates",
    type: "post",
    created_at: "",
    icon: IconYogas,
  },
  {
    id: "7p2v1Ur_O6",
    label: "quick reads",
    type: "post",
    created_at: "",
    icon: IconQuickReads,
  },
];
