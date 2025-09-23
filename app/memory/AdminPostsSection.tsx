
'use client';

interface Post {
  id: string;
  title: string;
  content: string;
  image: string;
  video?: string;
  date: string;
  type: 'update' | 'milestone' | 'announcement';
}

interface AdminPostsSectionProps {
  posts: Post[];
  onDeletePost: (postId: string) => void;
}

export default function AdminPostsSection({ posts, onDeletePost }: AdminPostsSectionProps) {
  const postTypeConfig = {
    update: {
      label: 'Progress Update',
      color: 'bg-blue-100 text-blue-800',
      icon: 'ri-information-line'
    },
    milestone: {
      label: 'Milestone',
      color: 'bg-green-100 text-green-800',
      icon: 'ri-flag-line'
    },
    announcement: {
      label: 'Announcement',
      color: 'bg-purple-100 text-purple-800',
      icon: 'ri-megaphone-line'
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Admin Updates</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Latest updates and milestones from our team about your special creation
          </p>
        </div>

        <div className="space-y-8">
          {posts.map((post, index) => (
            <div
              key={post.id}
              className="group relative"
            >
              {/* Timeline Line */}
              {index !== posts.length - 1 && (
                <div className="absolute left-6 top-24 w-0.5 h-full bg-gradient-to-b from-gray-300 to-transparent z-0"></div>
              )}

              <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500 z-10">
                {/* Admin Controls */}
                <div className="absolute top-4 right-4 z-20">
                  <button
                    onClick={() => onDeletePost(post.id)}
                    className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                    title="Delete Post"
                  >
                    <i className="ri-delete-bin-line text-red-600 text-sm"></i>
                  </button>
                </div>

                <div className="md:flex">
                  {/* Content Side */}
                  <div className="md:w-1/2 p-8">
                    <div className="flex items-start space-x-4">
                      {/* Timeline Dot */}
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] rounded-full flex items-center justify-center shadow-lg">
                        <i className={`${postTypeConfig[post.type].icon} text-white text-lg`}></i>
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Post Type Badge and Video Indicator */}
                        <div className="flex items-center space-x-3 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${postTypeConfig[post.type].color}`}>
                            {postTypeConfig[post.type].label}
                          </span>
                          {post.video && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 flex items-center space-x-1">
                              <i className="ri-video-line text-xs"></i>
                              <span>Video</span>
                            </span>
                          )}
                          <span className="text-sm text-gray-500">{formatDate(post.date)}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-800 mb-3 leading-tight">
                          {post.title}
                        </h3>

                        {/* Content */}
                        <p className="text-gray-600 leading-relaxed">
                          {post.content}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Media Side */}
                  <div className="md:w-1/2">
                    <div className="h-64 md:h-full relative">
                      {post.video ? (
                        <div className="relative w-full h-full bg-black rounded-r-3xl overflow-hidden">
                          {/* Video Placeholder - In real implementation, this would be an actual video */}
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                            <div className="text-center text-white">
                              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                                <i className="ri-play-fill text-3xl"></i>
                              </div>
                              <p className="text-sm font-medium">Video Update</p>
                              <p className="text-xs opacity-80 mt-1">Click to play</p>
                            </div>
                          </div>
                          
                          {/* Video Controls Overlay */}
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors cursor-pointer group/video">
                            <div className="absolute top-4 left-4">
                              <div className="bg-black/50 rounded-full px-2 py-1 flex items-center space-x-1">
                                <i className="ri-video-line text-white text-xs"></i>
                                <span className="text-white text-xs">Video</span>
                              </div>
                            </div>
                            
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/video:opacity-100 transition-opacity">
                              <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                                <i className="ri-play-fill text-purple-600 text-xl ml-1"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover object-top"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Admin Info */}
        <div className="mt-12 bg-blue-50 rounded-2xl p-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <i className="ri-admin-line text-white text-lg"></i>
            </div>
            <div>
              <h4 className="font-bold text-blue-900 mb-1">Admin Posts</h4>
              <p className="text-blue-700 text-sm">
                These posts are created by our team to keep you updated on the creation progress. 
                Posts can include photos and videos to show the manufacturing process in detail.
                Only administrators can create, edit, and delete these updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
