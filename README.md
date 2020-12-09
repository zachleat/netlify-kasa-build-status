# netlify-kasa-build-status

I have two KL130 smart bulbs from Kasa (TPLink).
I have a Netlify build that runs to deploy my site.
I wanted to show the status of my last two web site builds.

* Gnarly code warning: My lights are aliased as `Office 1` and `Office 2` and the code relies on these labels. Change the prefix in `netlify-build-lights.js`
* Rename `sample.env` to `.env` and fill in the values.
  * Find a [NETLIFY_TOKEN](https://app.netlify.com/user/applications#personal-access-tokens).
  * Find your Netlify site’s API ID on the Site details page. Mine was `https://app.netlify.com/sites/11ty/settings/general`
