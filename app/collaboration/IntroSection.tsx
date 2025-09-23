
export default function IntroSection() {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Why Join Our Designer Community?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-palette-line text-2xl text-indigo-600"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Creative Freedom</h3>
              <p className="text-gray-600">
                Express your artistic vision with complete creative control and showcase your unique style to the world.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-team-line text-2xl text-purple-600"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Collaborative Network</h3>
              <p className="text-gray-600">
                Connect with fellow designers, share ideas, and collaborate on exciting creative projects.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-trophy-line text-2xl text-green-600"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Recognition</h3>
              <p className="text-gray-600">
                Get your work recognized by a community that appreciates exceptional design and creativity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
