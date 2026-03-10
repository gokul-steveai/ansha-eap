import Container from "@/components/ui/container";
import ImageWithFallback from "@/components/ui/imageWithFallback";
import NumberDropdown from "@/components/ui/phoneNumbersDropdown";

const supportServices = [
  {
    name: "Lifeline 24/7",
    description: "Lifeline provides access to trained counselors who can offer support and guidance during difficult times.",
    img: "/assets/images/lifeline.jpg",
    numbers: ["13 11 14"],
  },
  {
    name: "Beyond Blue 24/7",
    description: "For support with anxiety, depression, and suicide prevention.",
    img: "/assets/images/beyond-blue.jpg",
    numbers: ["1300 22 4636"],
  },
  {
    name: "Kids Helpline 24/7",
    description: "Phone and online counseling service for young people aged 5 to 25.",
    img: "/assets/images/kids-helpline.jpg",
    numbers: ["1800 55 1800"],
  },
  {
    name: "13 YARN",
    description: "For Aboriginal and Torres Strait Islander people.",
    img: "/assets/images/13yarn.jpg",
    numbers: ["13 92 76"],
  },
  {
    name: "QLife 3pm - Midnight",
    description: "Mental health support for folk who identify as in the LGBTIQA community.",
    img: "/assets/images/lgbtq.jpg",
    numbers: ["13 92 76"],
  },
];

const CriticalResponsePage = () => {
  return (
    <Container>
      <div className="space-y-2">
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5 gap-y-10 w-full-sidebar">
          {supportServices.map((service) => (
            <div key={service.name} className="flex flex-col space-y-5 card min-h-[200px]">
              <ImageWithFallback
                className="w-full rounded-lg"
                alt={service.name}
                width={200}
                height={100}
                src={service.img}
              />
              <div className="flex flex-col gap-2 h-full">
                <p className="card-title font-medium">{service.name}</p>
                <p className="text-sm text-muted-foreground">{service.description}</p>
                <div className="mt-auto">
                  <NumberDropdown contents={service.numbers} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default CriticalResponsePage;
