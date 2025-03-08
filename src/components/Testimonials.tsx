
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex Thompson",
    title: "Trophy Hunter",
    quote: "This is the missing piece for achievement hunters. I've increased my platinum trophies by 40% since joining.",
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=150&fit=crop"
  },
  {
    name: "Mia Chen",
    title: "Casual Gamer",
    quote: "The AI recommendations helped me finish games I'd abandoned years ago. Now I'm actually completing my backlog!",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop"
  },
  {
    name: "Chris Dawson",
    title: "Competitive Player",
    quote: "The leaderboards add a whole new dimension to achievement hunting. Love competing with my friends!",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop"
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-16 container-padding bg-gradient-to-b from-black to-primary">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center neon-text">
          What Trophy Hunters Are Saying
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="glass-card p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 border border-neon-purple/30"
                />
                <div>
                  <h3 className="font-bold text-white">{testimonial.name}</h3>
                  <p className="text-sm text-neutral-300">{testimonial.title}</p>
                </div>
              </div>
              
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-neon-purple text-neon-purple" />
                ))}
              </div>
              
              <p className="text-neutral-300 italic">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
