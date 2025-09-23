
'use client';

import { useState } from 'react';

export default function DesignerFormSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    FNAME: '',
    LNAME: '',
    EMAIL: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Create a hidden iframe for form submission
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.name = 'hidden_iframe';
    document.body.appendChild(iframe);

    // Create a form element for submission
    const form = document.createElement('form');
    form.action = 'https://dreamli.us12.list-manage.com/subscribe/post';
    form.method = 'POST';
    form.target = 'hidden_iframe';

    // Add form fields
    const fields = [
      { name: 'u', value: 'b5c4e06a78dece913db9a1f79' },
      { name: 'id', value: '78ff17c433' },
      { name: 'FNAME', value: formData.FNAME },
      { name: 'LNAME', value: formData.LNAME },
      { name: 'EMAIL', value: formData.EMAIL },
      { name: 'tags', value: '12756085' },
      { name: 'b_b5c4e06a78dece913db9a1f79_78ff17c433', value: '' }
    ];

    fields.forEach(field => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = field.name;
      input.value = field.value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    
    // Submit form
    form.submit();
    
    // Clean up after a short delay
    setTimeout(() => {
      document.body.removeChild(form);
      document.body.removeChild(iframe);
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ FNAME: '', LNAME: '', EMAIL: '' });
    }, 1000);
  };

  if (submitStatus === 'success') {
    return (
      <section id="designer-form-section" className="py-16 bg-blue-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-check-line text-2xl text-green-600"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to the Team!
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Thanks for signing up! We'll review your application and send you an invitation to our designer portal within the next few days. 
              Keep an eye on your inbox for project opportunities that match your skills.
            </p>
            <button
              onClick={() => setSubmitStatus('idle')}
              className="text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
            >
              Sign up another designer
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="designer-form-section" className="py-16 bg-blue-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Join Our Designer Network
          </h2>
          <p className="text-lg text-gray-600">
            Ready to start creating amazing 3D designs for children?
          </p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg">
          <form 
            onSubmit={handleSubmit}
            id="designer-signup-form"
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="FNAME"
                  id="firstName"
                  value={formData.FNAME}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Your first name"
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="LNAME"
                  id="lastName"
                  value={formData.LNAME}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Your last name"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="EMAIL"
                id="email"
                value={formData.EMAIL}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="designer@example.com"
              />
            </div>

            <input type="hidden" name="tags" value="12756085" />
            <input type="hidden" name="b_b5c4e06a78dece913db9a1f79_78ff17c433" value="" />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg whitespace-nowrap"
            >
              {isSubmitting ? 'Joining...' : 'Join as a Designer'}
            </button>

            {submitStatus === 'error' && (
              <div className="text-red-600 text-sm text-center">
                <i className="ri-error-warning-line w-4 h-4 flex items-center justify-center inline mr-1"></i>
                Something went wrong. Please try again.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
