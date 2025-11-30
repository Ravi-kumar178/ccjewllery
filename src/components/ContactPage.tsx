import { Award, Heart, Sparkles, Users, Globe, Gem, Phone, Mail, MapPin  } from 'lucide-react';
import Footer from './Footer';

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-16">
      <HeroSection />
      <StorySection />
      <ValuesSection />
      <ContactFormSection />
      <StoreInfoSection />
      <MapSection />

      <Footer />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-pearl/30">
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(201, 169, 97, 0.1) 0%, transparent 70%)`,
      }} />

      <div className="relative z-10 text-center px-6">
        <h1 className="text-4xl md:text-6xl font-serif font-light text-charcoal mb-4 tracking-wide">
          Our Story
        </h1>
        <p className="text-sm text-charcoal/50 uppercase tracking-widest">
          Est. 2010
        </p>
      </div>
    </section>
  );
}

function StorySection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-charcoal mb-6 tracking-wide">
            A Legacy of
            <br />
            <span className="text-gold">Timeless Craftsmanship</span>
          </h2>
        </div>

        <div className="space-y-6 text-sm text-charcoal/70 leading-relaxed font-light">
          <p>
            Crystal Casting was founded with a singular vision: to create jewelry that transcends trends and becomes a cherished heirloom. What began as a small atelier has grown into a distinguished name in fine jewelry, trusted by collectors and connoisseurs worldwide.
          </p>
          <p>
            Our founder, inspired by the interplay of light and precious stones, pioneered innovative casting techniques that capture the natural beauty of crystals while ensuring unparalleled structural integrity. Each piece we create honors this tradition while embracing contemporary design sensibilities.
          </p>
          <p>
            Today, Crystal Casting continues to push boundaries in jewelry design, combining traditional goldsmithing with modern artistry. Our pieces are worn by those who appreciate the marriage of exceptional craftsmanship and timeless elegance.
          </p>
        </div>
      </div>
    </section>
  );
}

function ValuesSection() {
  const values = [
    {
      icon: Award,
      title: 'Excellence',
      description: 'Every piece meets the highest standards of quality and craftsmanship.',
    },
    {
      icon: Heart,
      title: 'Integrity',
      description: 'Ethically sourced materials and transparent business practices.',
    },
    {
      icon: Sparkles,
      title: 'Innovation',
      description: 'Pushing creative boundaries while honoring timeless traditions.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building lasting relationships with our clients and artisans.',
    },
  ];

  return (
    <section className="py-20 px-6 bg-pearl/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-charcoal mb-3 tracking-wide">
            Our Values
          </h2>
          <p className="text-xs text-charcoal/50 uppercase tracking-widest">
            What Guides Us
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="text-center animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 mb-4 border border-gold/20 rounded-full">
                <value.icon className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-base font-serif font-normal text-charcoal mb-2">
                {value.title}
              </h3>
              <p className="text-xs text-charcoal/60 leading-relaxed font-light">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-charcoal mb-3 tracking-wide">
            Master Artisans
          </h2>
          <p className="text-xs text-charcoal/50 uppercase tracking-widest">
            The Hands Behind the Beauty
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: 'Elena Rodriguez',
              role: 'Master Goldsmith',
              image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
            },
            {
              name: 'James Chen',
              role: 'Gemstone Specialist',
              image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400',
            },
            {
              name: 'Sophie Martin',
              role: 'Design Director',
              image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
            },
          ].map((member, index) => (
            <div
              key={index}
              className="text-center animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-4 overflow-hidden border border-charcoal/10">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-80 object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <h3 className="text-base font-serif font-normal text-charcoal mb-1">
                {member.name}
              </h3>
              <p className="text-xs text-charcoal/50 uppercase tracking-wider">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CraftsmanshipSection() {
  return (
    <section className="py-20 px-6 bg-pearl/20">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <div className="border border-charcoal/10 overflow-hidden">
              <img
                src="https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Craftsmanship"
                className="w-full h-96 object-cover"
              />
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-6 border border-gold/20 rounded-full">
              <Gem className="w-5 h-5 text-gold" />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-light text-charcoal mb-5 tracking-wide">
              The Art of
              <br />
              <span className="text-gold">Precision</span>
            </h2>
            <p className="text-sm text-charcoal/60 mb-4 leading-relaxed font-light">
              Each piece undergoes a meticulous creation process spanning weeks or even months. From initial sketches to final polish, our artisans employ both time-honored techniques and cutting-edge technology.
            </p>
            <p className="text-sm text-charcoal/60 leading-relaxed font-light">
              We hand-select every gemstone for its unique character, ensuring that each creation is truly one-of-a-kind. Our commitment to excellence means that only pieces meeting our exacting standards bear the Crystal Casting mark.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SustainabilitySection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center justify-center w-12 h-12 mb-6 border border-gold/20 rounded-full">
              <Globe className="w-5 h-5 text-gold" />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-light text-charcoal mb-5 tracking-wide">
              Ethical Sourcing,
              <br />
              <span className="text-gold">Sustainable Future</span>
            </h2>
            <p className="text-sm text-charcoal/60 mb-4 leading-relaxed font-light">
              We believe luxury and responsibility go hand in hand. All our gemstones are ethically sourced, with full traceability from mine to finished piece. We partner only with suppliers who share our commitment to fair labor practices and environmental stewardship.
            </p>
            <p className="text-sm text-charcoal/60 leading-relaxed font-light">
              Our precious metals are recycled whenever possible, and our packaging uses sustainable materials. We're constantly evolving our practices to minimize our environmental footprint while maintaining the exceptional quality you expect.
            </p>
          </div>

          <div>
            <div className="border border-charcoal/10 overflow-hidden">
              <img
                src="https://images.pexels.com/photos/1346187/pexels-photo-1346187.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Sustainability"
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactFormSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-charcoal mb-3 tracking-wide">
            Get in Touch
          </h2>
          <p className="text-xs text-charcoal/50 uppercase tracking-widest">
            We'd Love to Hear from You
          </p>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="First Name"
            className="p-3 border border-charcoal/20 bg-pearl/20 rounded-xl outline-none focus:ring-1 focus:ring-gold text-sm"
          />
          <input
            type="text"
            placeholder="Last Name"
            className="p-3 border border-charcoal/20 bg-pearl/20 rounded-xl outline-none focus:ring-1 focus:ring-gold text-sm"
          />
          <input
            type="email"
            placeholder="Email Address"
            className="p-3 border border-charcoal/20 bg-pearl/20 rounded-xl outline-none focus:ring-1 focus:ring-gold text-sm col-span-1 md:col-span-2"
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="p-3 border border-charcoal/20 bg-pearl/20 rounded-xl outline-none focus:ring-1 focus:ring-gold text-sm col-span-1 md:col-span-2"
          />
          <textarea
            rows="5"
            placeholder="Your Message"
            className="p-3 border border-charcoal/20 bg-pearl/20 rounded-xl outline-none focus:ring-1 focus:ring-gold text-sm md:col-span-2"
          ></textarea>

          <button className="py-3 bg-gold text-white rounded-xl text-sm md:col-span-2 hover:bg-gold/90 transition">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}



function StoreInfoSection() {
  const items = [
    {
      icon: Phone,
      title: "Phone",
      value: "+91 9876543210",
    },
    {
      icon: Mail,
      title: "Email",
      value: "support@crystalcasting.com",
    },
    {
      icon: MapPin,
      title: "Location",
      value: (
        <>
          Crystal Casting Studio <br />
          Patna, Bihar — 800001 <br />
          India
        </>
      ),
    },
  ];

  return (
    <section className="py-20 px-6 bg-pearl/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-charcoal mb-3 tracking-wide">
            Contact Details
          </h2>
          <p className="text-xs text-charcoal/50 uppercase tracking-widest">
            Reach Us Anytime
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="text-center animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon Container */}
              <div className="inline-flex items-center justify-center w-16 h-16 mb-5 border border-gold/20 rounded-full">
                <item.icon className="w-7 h-7 text-gold" />
              </div>

              {/* Title */}
              <h3 className="text-base font-serif font-normal text-charcoal mb-2">
                {item.title}
              </h3>

              {/* Value */}
              <p className="text-sm text-charcoal/60 leading-relaxed font-light">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function MapSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-charcoal tracking-wide">
            Find Us on the Map
          </h2>
        </div>

        <div className="border border-charcoal/10 rounded-xl overflow-hidden">
          <iframe
            src="https://maps.google.com/maps?q=Patna,%20Bihar&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full h-[400px]"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
