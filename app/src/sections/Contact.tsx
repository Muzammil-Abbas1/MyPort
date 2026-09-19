import { useEffect, useRef, useState } from 'react';
import SectionHeader from "@/components/SectionHeader";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      
      setTimeout(() => setSubmitted(false), 3000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    { icon: <Mail className="w-5 h-5" />, label: 'Email', value: '210muzammilabbas@gmail.com', href: 'mailto:210muzammilabbas@gmail.com' },
    { icon: <Phone className="w-5 h-5" />, label: 'Phone', value: '+92 3118911228', href: 'tel:+923118911228' },
    { icon: <MapPin className="w-5 h-5" />, label: 'Location', value: 'Islamabad, Pakistan', href: '#' },
  ];

  return (
    <section 
      ref={sectionRef}
      id="contact" 
      className="py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-background overflow-x-clip"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <SectionHeader
          eyebrow="Contact"
          title="Get In Touch"
          subtitle="Let's build something amazing together"
        />

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div 
            className={`space-y-6 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-xl font-bold text-cyan mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                    style={{ 
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
                      transition: `all 0.5s ease ${300 + index * 100}ms`
                    }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-cyan/10 flex items-center justify-center text-cyan group-hover:bg-cyan group-hover:text-background transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="font-medium text-foreground group-hover:text-cyan transition-colors">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>

              <Button 
                className="w-full mt-6 bg-gradient-to-r from-cyan to-purple hover:opacity-90 text-white font-semibold"
                onClick={() => window.open('https://wa.me/923118911228', '_blank')}
                 >
               Hire Me for Freelance/Contract Work
                </Button>
            </div>
          </div>

          {/* Contact Form */}
          <div 
            className={`transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-xl font-bold text-purple mb-6">Send a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-background border-border focus:border-cyan focus:ring-cyan/20"
                  />
                </div>
                
                <div>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-background border-border focus:border-cyan focus:ring-cyan/20"
                  />
                </div>
                
                <div>
                  <Textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="bg-background border-border focus:border-cyan focus:ring-cyan/20 resize-none"
                  />
                </div>
                
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple to-cyan hover:opacity-90 text-white font-semibold"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : submitted ? (
                    <span className="flex items-center gap-2">
                      Message Sent!
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Send Message
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
