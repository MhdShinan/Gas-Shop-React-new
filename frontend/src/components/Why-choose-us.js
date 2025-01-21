import React from 'react';

import C1 from "../assets/images/download (3).png";
import C2 from "../assets/images/download (2).png";
import C3 from "../assets/images/images (2).jpeg";

const FeatureBox = ({ image }) => {
  return React.createElement('div', {
    className: 'bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow'
  },
    React.createElement('div', {
      className: 'flex flex-col items-center text-center'
    },
      React.createElement('img', {
        src: image,
        alt: 'Feature Image',
        className: 'w-[200px] h-[200px] mb-2 rounded-full'  // Adding rounded-full for curved image corners
      })
    )
  );
};

const WhyChooseUs = () => {
  const features = [
    { image: C1 },
    { image: C2 },
    { image: C3 }
  ];

  return React.createElement('section', {},
    React.createElement('div', {
      className: 'container mx-auto px-4'
    },
      React.createElement('h2', {
        className: 'text-3xl md:text-4xl font-bold text-center text-[#0038FF] mb-6'
      }, 'Why Choose Us?'),
      React.createElement('div', {
        className: 'grid grid-cols-1 md:grid-cols-3 gap-4'
      },
        features.map((feature, index) =>
          React.createElement(FeatureBox, {
            key: index,
            image: feature.image
          })
        )
      )
    )
  );
};

export default WhyChooseUs;
