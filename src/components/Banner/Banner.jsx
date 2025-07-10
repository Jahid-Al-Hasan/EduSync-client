const Banner = () => {
  return (
    <section className="relative bg-base-200">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10"></div>
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Elevate Your Learning Experience
          </h1>
          <p className="text-lg mb-8">
            Connect with expert tutors and join interactive study sessions
            designed to maximize your academic potential.
          </p>
          <div className="flex gap-4">
            <button className="btn btn-primary">Browse Sessions</button>
            <button className="btn btn-outline">Become a Tutor</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
