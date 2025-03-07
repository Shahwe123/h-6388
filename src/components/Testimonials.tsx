
const testimonials = [
  {
    quote: "This app has transformed how I track my platinums. The AI suggestions for what to complete next are spot on!",
    author: "Alex Chen",
    role: "Platinum Hunter",
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&h=100&fit=crop",
  },
  {
    quote: "The backlog dungeon feature alone has saved me from abandoning so many games at 95% completion.",
    author: "Marcus Thompson",
    role: "Achievement Hunter",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  },
  {
    quote: "Finally, I can show off my gaming accomplishments in one place. The leaderboards are addictive!",
    author: "Elena Rodriguez",
    role: "Competitive Gamer",
    avatar: "https://images.unsplash.com/photo-1573497161161-c3e73707e25c?w=100&h=100&fit=crop",
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-16 container-padding bg-black">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
          What Trophy Hunters Are Saying
        </h2>
        <p className="text-neutral-300 text-center mb-12 max-w-2xl mx-auto">
          Join thousands of gamers who are mastering their achievement collection.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="glass-card p-6 rounded-xl">
              <p className="text-neutral-300 mb-6">{testimonial.quote}</p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-10 h-10 rounded-full border-2 border-neon-purple"
                />
                <div>
                  <p className="font-semibold text-white">{testimonial.author}</p>
                  <p className="text-sm text-neon-purple">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
