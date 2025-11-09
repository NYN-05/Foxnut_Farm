import { motion } from 'framer-motion';

const RecipeSection = () => {
  const recipes = [
    {
      id: 1,
      title: "Spiced Foxnut Chaat",
      description: "A tangy and crunchy Indian street food snack with foxnuts, tomatoes, and aromatic spices",
      image: "/recipes/foxnut-chaat.jpg",
      prepTime: "10 mins",
      difficulty: "Easy",
      category: "Snack"
    },
    {
      id: 2,
      title: "Foxnut Trail Mix",
      description: "Energy-packed mix with foxnuts, nuts, dried fruits, and dark chocolate for healthy snacking",
      image: "/recipes/trail-mix.jpg",
      prepTime: "5 mins",
      difficulty: "Easy",
      category: "Snack"
    },
    {
      id: 3,
      title: "Creamy Foxnut Kheer",
      description: "Traditional Indian dessert made with foxnuts, milk, saffron, and cardamom",
      image: "/recipes/foxnut-kheer.jpg",
      prepTime: "30 mins",
      difficulty: "Medium",
      category: "Dessert"
    }
  ];

  return (
    <section className="section-padding bg-white" id="recipes">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="heading-2 mb-4">Foxnut Recipes & Blog</h2>
          <p className="text-body max-w-2xl mx-auto">
            Discover delicious and healthy ways to enjoy foxnuts in your daily meals
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {recipes.map((recipe, index) => (
            <motion.article
              key={recipe.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="card group cursor-pointer hover:shadow-2xl transition-shadow"
              role="article"
              aria-label={`Recipe: ${recipe.title}`}
            >
              {/* Recipe Image */}
              <div className="h-56 relative overflow-hidden">
                <img
                  src={recipe.image}
                  alt={`${recipe.title} - Foxnuts recipe`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: '#F9C74F' }}
                  >
                    {recipe.category}
                  </span>
                </div>
              </div>

              {/* Recipe Info */}
              <div className="p-6 bg-white">
                <h3 className="heading-3 mb-3 text-xl">{recipe.title}</h3>
                <p className="text-body mb-4 text-sm min-h-[3rem]">{recipe.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{recipe.prepTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{recipe.difficulty}</span>
                  </div>
                </div>

                <button
                  className="mt-4 w-full py-2 border-2 rounded-full font-semibold transition-all hover:bg-[#74B72E] hover:text-white hover:border-[#74B72E]"
                  style={{ borderColor: '#74B72E', color: '#74B72E' }}
                  aria-label={`View ${recipe.title} recipe`}
                >
                  View Recipe
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        {/* CTA to Blog */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <button 
            className="btn-secondary px-8 py-3"
            aria-label="View all recipes and blog posts"
          >
            View All Recipes →
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default RecipeSection;
