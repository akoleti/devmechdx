import Image from 'next/image';
import { Star, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    quote: "MechDX has transformed our maintenance operations. We've seen a 40% reduction in equipment downtime and significant cost savings.",
    author: "Sarah Chen",
    title: "Head of Operations",
    company: "Global Manufacturing Co.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=200&h=200&auto=format&fit=crop",
    metrics: {
      downtime: "40% reduction",
      savings: "$2.5M annually"
    },
    industry: "Manufacturing"
  },
  {
    quote: "The predictive maintenance capabilities have helped us prevent major equipment failures. The ROI has been remarkable.",
    author: "Michael Rodriguez",
    title: "Facility Manager",
    company: "Healthcare Systems Inc.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&auto=format&fit=crop",
    metrics: {
      uptime: "99.9% achieved",
      efficiency: "45% improved"
    },
    industry: "Healthcare"
  },
  {
    quote: "Implementation was smooth, and the mobile access has made our team significantly more productive in the field.",
    author: "David Park",
    title: "Technical Director",
    company: "Construction Partners Ltd.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&h=200&auto=format&fit=crop",
    metrics: {
      productivity: "35% increase",
      response: "60% faster"
    },
    industry: "Construction"
  }
];

const clientLogos = [
  { 
    name: "CCISD",
    logo: "/images/brands/ccisd.png"
  },
  { 
    name: "GrayGrids",
    logo: "/images/brands/graygrids.svg",
    darkLogo: "/images/brands/graygrids-light.svg"
  },
  { 
    name: "FormBold",
    logo: "/images/brands/formbold.svg",
    darkLogo: "/images/brands/formbold-light.svg"
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by Industry Leaders
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            See how organizations are transforming their maintenance operations with MechDX
          </p>
        </div>

        {/* Client Logos */}
        <div className="mt-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 items-center justify-items-center">
            {clientLogos.map((client) => (
              <div
                key={client.name}
                className="col-span-1 flex justify-center grayscale hover:grayscale-0 transition-all"
              >
                <Image
                  src={client.logo}
                  alt={client.name}
                  width={160}
                  height={80}
                  className="h-12 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              className={cn(
                "relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow",
                index === 1 && "md:translate-y-8"
              )}
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-blue-100" />
              
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.author}
                    fill
                    className="rounded-full object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-gray-900">
                    {testimonial.author}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {testimonial.title} at {testimonial.company}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                {Object.entries(testimonial.metrics).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-2xl font-bold text-blue-600">{value}</p>
                    <p className="text-sm text-gray-500 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 inline-block text-sm font-medium text-blue-600">
                Read full case study →
              </div>
            </div>
          ))}
        </div>

        {/* Overall Impact Metrics */}
        <div className="mt-20 bg-blue-600 rounded-2xl p-12 text-white">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold">Global Impact</h3>
            <p className="mt-2 text-blue-100">
              Measurable results across industries worldwide
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold">500+</p>
              <p className="mt-2 text-blue-100">Enterprise Clients</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">$100M+</p>
              <p className="mt-2 text-blue-100">Client Savings</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">45%</p>
              <p className="mt-2 text-blue-100">Efficiency Gain</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">99.9%</p>
              <p className="mt-2 text-blue-100">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 