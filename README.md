# jer_seinfeld
The bot which lives at https://monads.online/@jer_seinfeld

# Configuration

Clone the repo and run `npm install`.

You will need to have `imagemagick` installed on the system.

You will also need an `env.json` file containing four keys,

INPUT_MASTODON_ACCESS_TOKEN which is an access token for an instance that can read jer's toots.
INPUT_MASTODON_API which is the API endpoint for the instance.
OUTPUT_MASTODON_ACCESS_TOKEN which is an access token for an account that can make posts.
OUTPUT_MASTODON_API which is the API endpoint for the account that will be posting.

# Usage

Simply run `node index.js` and an image will be generated and posted.
