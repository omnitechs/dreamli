
'use client';

export default function TrustSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
            <i className="ri-heart-3-line text-2xl text-white w-6 h-6 flex items-center justify-center"></i>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Why This Blog Matters</h2>
        
        <div className="text-lg text-gray-700 leading-relaxed space-y-4">
          <p>
            Dreamli is built on research showing how creative play boosts focus, problem-solving, and confidence in children. 
            Our blog shares expert advice, family stories, and inspiring activities to help you nurture your child's imagination.
          </p>
          
          <p>
            Every article is crafted with care by child development experts, educators, and real parents who understand 
            the magic that happens when creativity meets learning.
          </p>
        </div>
        
        <div className="flex items-center justify-center space-x-8 mt-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">Research</div>
            <div className="text-sm text-gray-600">Based Content</div>
          </div>
        </div>
      </div>
    </section>
  );
}
