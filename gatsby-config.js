module.exports = {
  siteMetadata: {
    title: 'EV Charging in Real-time'
  },
  plugins: [
    `gatsby-plugin-glamor`,
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/data/`
      }
    },
    {
      resolve: `gatsby-transformer-csv`,
      options: {
        noheader: true
      }
    }
  ]
}
 