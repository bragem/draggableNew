module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        custom: '1px 3px 20px 10px rgba(0,0,0,.16)'
      },
      placeholderColor: {
        primary: '#828282'
      },
      transitionProperty: {
        height: 'height'
      },
      fontFamily: {
        poppins: ['Poppins', 'Ubuntu']
      }
    }
  },
  plugins: []
}
