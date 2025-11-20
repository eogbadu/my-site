import type { ResumeData } from "@/types/content";

export const resume: ResumeData = {
  name: "Ekele Ogbadu",
  tagline: "AI/ML Engineer • Researcher • Builder",
  summary:
    "AI/ML Engineer with experience building large-scale, production-grade systems across deep learning, NLP, computer vision, and multimodal perception. Skilled in designing retrieval-augmented generation (RAG) pipelines, vector search services, and knowledge systems using AWS Bedrock, OpenSearch, and modern embedding models. AWS Machine Learning – Specialty certified, with strong proficiency in TensorFlow, Python/Pandas, and cloud-native ML architectures across EC2, S3, Lambda, SageMaker, and distributed training workflows. Proven ability to improve model performance, optimize latency, and deploy robust ML services for autonomy, search, and real-time analytics.",
  sections: [
    {
      heading: "Experience",
      items: [
        {
          title: "Senior Artificial Intelligence/Machine Learning Engineer",
          org: "Booz Allen Hamilton",
          location: "Hybrid",
          period: "September 2025 — Present",
          bullets: [
            "Develop and deploy AI/ML solutions integrating NLP, computer vision, and multimodal learning for enterprise and government applications.",
            "Build automated data ingestion and enrichment pipelines using Python, TensorFlow, pandas, and NumPy to process and prepare large document sets.",
            "Create tagging workflows that combine scraped web data, knowledge bases, and LLMs such as Claude Sonnet to generate and refine metadata for search and discovery.",
            "Measure and improve tag accuracy through evaluation metrics and feedback loops to enhance search relevance and content quality.",
            "Leverage AWS Bedrock and OpenSearch to enable scalable, AI-driven document retrieval and semantic search capabilities.",
            "Collaborate with cross-functional teams to translate mission requirements into reliable, production-grade machine learning systems.",
          ],
        },
        {
          title: "Graduate TA / Research Assistant",
          org: "UMBC IRAL Lab",
          location: "Baltimore, MD",
          period: "May 2023 — Present",
          bullets: [
            "Built SCOUT++ dataset; evaluated VLMs for instruction grounding.",
            "Designed graduate AI homework sets and rubrics.",
            "Spearheaded research on multi-modal AI for human-robot interaction, integrating text, images, and sensor data (3D point clouds, audio, ROS bag files) to enhance robot understanding and response generation.",
            "Reconstructed and extended the SCOUT dataset, producing a standardized corpus of over 11,000 timestamp-aligned images and 2,474 unique dialogue pairs, enabling rigorous evaluation of multi-modal models.",
            "Designed and implemented NLP pipelines transitioning from traditional Bag-of-Words models to neural network-based architectures using TensorFlow, PyTorch, and GloVe embeddings, achieving accuracy improvements of up to 12% over baseline methods in dialogue classification tasks.",
            "Conducted advanced experiments with GPT-4, exploring both text-only and multimodal (text + vision) capabilities, demonstrating enhanced contextual understanding and improved robot action selection in complex scenarios.",
            "Developed robust, reusable Python tools for data preprocessing, feature engineering, and experiment orchestration, leveraging Pandas, NumPy, OpenCV, and ROS to support scalable machine learning workflows and ensure reproducibility.",
            "Presented findings at lab meetings, university symposiums, and collaborative research sessions, effectively communicating complex technical concepts to diverse audiences.",
            "Mentored undergraduate students on machine learning projects, fostering technical skill development and research engagement.",
            "Authored and contributed to research publications targeting conferences such as EMNLP and HRI, focusing on improving robotic perception and decision-making through multi-modal learning.",
          ],
        },
        {
          title: "Release Manager/Senior Agile Engineer ",
          org: "Booz Allen Hamilton",
          location: "Hybrid",
          period: "July 2024 — August 2025",
          bullets: [
            "Led software release cycles for production deployments, coordinating cross-functional teams and reducing release time by 34% through process optimization and automation.",
            "Managed complex release planning, PI Planning under SAFe, stakeholder communications, and Field Service Representative scheduling to ensure operational readiness.",
            "Led software release cycles for production deployments, coordinating cross-functional teams and reducing average release cycle time by 34% through process optimization and automation.",
            "Participated in Scaled Agile Framework (SAFe) processes, actively contributing to Program Increment (PI) Planning to align teams, prioritize work, and coordinate complex multi-team deliverables.",
            "Developed and executed detailed release plans and deployment schedules, managing timelines, dependencies, and resources across simultaneous projects to ensure on-time, high-quality deliveries.",
            "Managed schedules and task assignments for Field Service Representatives, ensuring operational readiness and efficient support during production deployments",
            "Facilitated weekly stakeholder meetings, delivering status updates, aligning priorities, and proactively identifying and mitigating release risks",
            "Championed the implementation of a new release management system, leveraging tools such as Jira and Confluence to improve team efficiency, transparency, and release predictability",
            "Designed and delivered executive-level presentations, translating complex data into visually compelling, easily understood insights. Presented release metrics and program health updates to audiences including all program stakeholders",
            "Implemented metrics and KPIs to monitor release success, identify process bottlenecks, and drive continuous improvement initiatives",
            "Led post-release reviews and root cause analyses, capturing lessons learned and integrating improvements into future release cycles",
            "Applied Agile methodologies (Scrum, Kanban, SAFe) to enhance collaboration, optimize workflows, and promote iterative delivery practices",
          ],
        },
        {
          title: "Software Engineering Team Lead",
          org: "Prescient Edge Corporation",
          location: "Hybrid",
          period: "August 2023 - July 2024",
          bullets: [
            "Led a team of four software developers in maintaining and enhancing the Minotaur platform, coordinating feature development and bug fixes across C++, Java, React, and TypeScript codebases.",
            "Designed and implemented a developer training program that reduced onboarding time for junior engineers by 60%, accelerating team productivity and knowledge transfer.",
            "Managed issue tracking and workflow using GitLab and ClearCase, ensuring timely resolution of defects and efficient task allocation to team members.",
            "Oversaw hardware and software procurement for test bench environments, ensuring accurate specifications and seamless integration across multiple platforms.",
            "Led system testing of the latest software builds, identifying defects, documenting issues, and coordinating prompt fixes to maintain software quality and reliability.",
            "Led code reviews and established development best practices, improving code quality and reducing defect rates.",
            "Collaborated with stakeholders to translate complex requirements into technical specifications and actionable project plans.",
            "Facilitated Agile ceremonies, including daily stand-ups, sprint planning, and retrospectives, to maintain team alignment and deliver milestones on schedule.",
            "Authored technical documentation and knowledge-sharing materials, ensuring consistent understanding of systems and processes across the team.",
            "Mentored junior developers, providing guidance on technical challenges, career growth, and best practices in software engineering.",
          ],
        },
        {
          title: "Machine Learning Engineer",
          org: "Prescient Edge Corporation",
          location: "Hybrid",
          period: "May 2022 - August 2023",
          bullets: [
            "Collaborated as part of a team developing a Hull Identification Number (HIN) object detection system for the US Coast Guard, contributing to image preprocessing workflows for infrared and visible-spectrum camera data, and assisting in training YOLO-based detection models using TensorFlow and OpenCV.",
            "Designed, implemented, and tested sensor fusion algorithms that combined radar data with camera inputs to accurately track high-speed vessels, enabling real-time camera tilt and zoom adjustments for precise hull number capture. Validated system performance through testing on live operational assets.",
            "Engineered the integration of radar data into the machine learning pipeline, utilizing the Rust programming language to develop low-latency data retrieval and preprocessing capabilities for downstream ML applications.",
            "Applied software engineering best practices, including modular code design and code reviews, to enhance maintainability and reliability of machine learning solutions.",
            "Collaborated closely with radar engineers and mission operators to ensure that machine learning components met operational requirements and performed effectively in real-world conditions.",
            "Established reproducibility practices for machine learning experiments, implementing version control and systematic tracking of data preprocessing, model configurations, and results to ensure reliable research outcomes.",
          ],
        },
        {
          title: "Software Developer",
          org: "Prescient Edge Corporation",
          location: "Hybrid",
          period: "February 2021 - May 2022",
          bullets: [
            "Employed modern DevOps practices using GitLab to support continuous integration and continuous delivery (CI/CD) pipelines for the US Coast Guard’s MINOTAUR system and projects at the Johns Hopkins University Applied Physics Laboratory.",
            "Developed and maintained mission-critical software deployed on USCG rescue aircraft, fixing bugs and implementing new features in C++, React, TypeScript, and other technologies.",
            "Integrated support for network and avionics communication protocols, including UDP/TCP, MIL-STD-1553, and ARINC-429, ensuring seamless interoperability between the software and onboard mission hardware and sensors.",
            "Interpreted Interface Control Documents (ICDs) to translate complex hardware specifications into precise software requirements, enabling accurate integration of diverse mission systems.",
            "Enhanced Java-based GUIs with NetBeans and C++ GUIs with Qt, building simulation tools to replicate pilot controls and facilitate testing of avionics data exchanges.",
            "Conducted extensive software testing both in simulated environments and directly on operational aircraft assets, verifying system reliability and compliance with stringent mission requirements.",
            "Collaborated with cross-functional teams, including hardware engineers and mission operators, to troubleshoot integration challenges and deliver high-reliability software for defense and aerospace applications.",
          ],
        },
        {
          title: "Graduate Teaching Assistant",
          org: "University of Maryland - Baltimore County",
          location: "Baltimore, MD",
          period: "August 2022 - May 2023",
          bullets: [
            "Served as a teaching assistant for Operating Systems and Computer Organization and Assembly Language Programming courses, supporting undergraduate students in understanding core concepts of compiler construction, computer architecture, and low-level programming.",
            "Assisted faculty in developing lecture materials, designing programming assignments, and preparing exam content to enhance student engagement and comprehension.",
            "Provided individualized and group support through office hours and online platforms, answering technical questions and guiding students through programming tasks in languages such as C and assembly.",
            "Graded assignments, projects, and exams for classes of approximately 80 students ensuring fair, timely, and consistent evaluation of student performance.",
            "Collaborated with professors to refine course content and incorporate emerging technologies and trends, contributing to continuous curriculum improvement.",
            "Fostered a supportive learning environment, helping students build problem-solving skills and confidence in tackling complex technical subjects.",
          ],
        },
        {
          title: "Computer Science Tutor",
          org: "University of Maryland - Baltimore County",
          location: "Baltimore, MD",
          period: "February 2022 - May 2022",
          bullets: [
            "Tutored several Computer Science courses including Computer Architecture, Data Structures & Algorithms,  Machine Learning, Operating Systems, and Computer Graphics among others.",
            "Provided one-on-one and small group tutoring for undergraduate students across multiple computer science courses, including Computer Architecture, Data Structures & Algorithms, Machine Learning, Operating Systems, and Computer Graphics.",
            "Explained complex technical concepts in programming, algorithm design, and system architecture, adapting teaching strategies to meet diverse learning styles and backgrounds.",
            "Assisted students with debugging code, preparing for exams, and developing problem-solving skills critical for academic success in rigorous computer science courses.",
            "Developed supplemental learning resources, such as practice problems and concept summaries, to reinforce course materials and enhance student understanding.",
            "Fostered a supportive and collaborative learning environment, helping students build confidence and achieve their academic goals.",
          ],
        },
        {
          title: "Aviation Administrationman/E-5",
          org: "US NAVY",
          location: "Whidbey Island, WA",
          period: "October 2014 - October 2018",
          bullets: [
            "Supervised night shift operations for military command processes, overseeing data management and workflow using NALCOMIS OMA database software to track and update aircraft engines, military support equipment lifecycles, and digital maintenance records.",
            "Utilized SYBASE database software to write and modify SQL scripts, enabling analysis of aircraft performance and personnel trends to support operational decision-making.",
            "Managed over 900 physical records and 86 digital equipment files, ensuring timely execution of scheduled and unscheduled maintenance inspections critical to mission readiness and equipment safety.",
            "Served as technical publications librarian, maintaining the inventory and currency of technical manuals and documentation for administrative and maintenance operations.",
            "Leveraged the full Microsoft Office suite daily to prepare reports, create presentations, and develop Excel macros for advanced data analysis and process automation.",
            "Collaborated with cross-functional military teams to maintain accurate records, streamline maintenance operations, and uphold compliance with Navy standards and procedures.",
          ],
        },
        {
          title: "Software Developer",
          org: "Multiple Projects",
          location: "Remote",
          period: "October 2010 - October 2018",
          bullets: [
            "Designed and developed fully responsive websites for diverse clients using HTML, CSS, and JavaScript, delivering custom solutions tailored to business needs and user experience best practices.",
            "Built and published mobile games for iOS and Android platforms using Unity3D and Xcode, managing the complete development lifecycle from concept to app store deployment.",
            "Customized and extended client websites using content management systems (CMS) such as WordPress, Joomla, Ecommerce Templates, and ClipBucket Video CMS, enhancing site functionality and user engagement.",
            "Implemented SEO strategies and monetization features across web and mobile projects, improving visibility, user acquisition, and revenue potential for clients.",
            "Created and edited graphic assets using Photoshop and GIMP, producing transparent images and custom designs optimized for web and mobile interfaces.",
            "Managed client relationships, gathered requirements, and delivered projects on schedule, ensuring high client satisfaction and repeat business.",
          ],
        },
      ],
    },
    {
      heading: "Education",
      items: [
        {
          title: "PhD Candidate (in progress), Computer Science",
          org: "University of Maryland, Baltimore County",
          period: "May 2022 — Present",
        },
        {
          title: "M.S in Computer Science",
          org: "University of Maryland, Baltimore County",
          period: "May 2022 — May 2024",
        },
        {
          title: "B.S in Computer Science (Concentration in Data Science)",
          org: "University of Maryland, Baltimore County",
          period: "January 2019 — May 2022",
        },
        {
          title: "B.A in Mathematics",
          org: "University of Maryland, Baltimore County",
          period: "January 2019 — May 2022",
        },
      ],
    },
    {
      heading: "Technological Proficiencies",
      items: [
        {
          title: "Software Languages",
          bullets: [
            "C/C++ | Python | Rust | JavaScript | Java | HTML | CSS | Bash Linux | COBOL",
          ],
        },
        {
          title: "Frameworks/Tools",
          bullets: [
            "Amazon AWS | TensorFlow | OpenCV | MATLAB | SAS | R | Scikit-learn | ROS | MongoDB",
            "MySQL | PostgresSQL | Express | React | Node.js | NumPy | Pandas | BeautifulSoup",
            "Matplotlib | Jupyter Notebooks | Google Colab | Gimp | Tailwind CSS | FastAPI",
          ],
        },
        {
          title: "Data/ML Skills",
          bullets: [
            "Data Visualization | Predictive Analysis | Statistical Modeling | Clustering | Classification",
            "Data Analytics | ML Algorithms | Model Development | Computer Vision | Deep Learning | NLP | LLMs",
            "Statistical Analysis | AWS Sagemaker | Linear/Logistic regression",
          ],
        },
        {
          title: "Industry Processes/Tools",
          bullets: [
            "CI/CD | Agile | JIRA | Kanban | Waterfall | Git | Gitlab | GitHub | Vim | Emacs | Eclipse | XCode",
            "Android Studio | VSCode | Visual Studio",
          ],
        },
        {
          title: "Operating Systems",
          bullets: ["Windows | MacOS | Android | IOS | Ubuntu | RHEL | VMWare"],
        },
      ],
    },
    {
      heading: "Certifications",
      items: [
        {
          title: "2025",
          bullets: [
            "Booz Allen Artificial Intelligence Engineer Expert",
            "Booz Allen Artificial Intelligence Engineer Practitioner",
            "CompTIA Security+ ce Certification",
          ],
        },
        {
          title: "2024",
          bullets: [
            "AWS Certified Machine Learning Specialty",
            "Certified SAFe 6 Practitioner",
            "AWS Certified Cloud Practitioner",
          ],
        },
        {
          title: "2023",
          bullets: [
            "Unsupervised Learning, Recommenders, Reinforcement Learning",
            "Advanced Learning Algorithms",
            "Supervised Machine Learning: Regression and Classification",
          ],
        },
      ],
    },
  ],
};
