<template>
  <div class="tools">
    <sub-header title="Tools & Scripts" />

    <div class="content">
      <div class="tools">
        <div class="col">
          <div class="cards row mt-8">
            <div class="card">
              <h3>Interactive walls length fixer for rankability</h3>
              <p>
                Thanks Qwasyx for proper wall detection code since I'm lazy.
                <br>
                <br>
                Enter bpm and upload file
              </p>

              <InputText v-model="bpm" placeholder="BPM" />

              <div id="fileinputblaWalls" class="buttons">
                <div style="flex: 1" />

                <my-button outlined @click="$refs.wallsInput.click()">
                  Upload difficulty
                  <i class="bx bx-upload" />
                </my-button>
                <input
                  id="file"
                  ref="wallsInput"
                  style="display: None"
                  type="file"
                  name="file"
                  accept=".dat,.json"
                  @change="fixWalls"
                >
              </div>
            </div>
            <div class="card">
              <h3>Notes to dots converter</h3>
              <p>
                Converts all notes to bottom right dot notes so it can technically be used as timings
                (theoretically)
              </p>

              <my-checkbox v-model="dotsConverter.obstacles" label="Remove Obstacles" />
              <my-checkbox v-model="dotsConverter.lights" label="Remove Lights" />
              <my-checkbox v-model="dotsConverter.bookmarks" label="Remove Bookmarks" />

              <div id="fileinputbla" class="buttons">
                <div style="flex: 1" />

                <my-button outlined @click="$refs.dotsInput.click()">
                  Upload difficulty
                  <i class="bx bx-upload" />
                </my-button>
                <input
                  id="file"
                  ref="dotsInput"
                  style="display: None"
                  type="file"
                  name="file"
                  accept=".dat,.json"
                  @change="convertToDots"
                >
              </div>
            </div>
            <div class="card">
              <h3>Ranking Queue Playlist</h3>
              <p>
                Playlist will update every 3 hours.
                <br>
              </p>

              <my-button
                href="bsplaylist://playlist/https://muffnlabs.de/static/ranking-queue.bplist"
                outlined
                notblank
              >
                One-Click Install
                <i class="bx bx-cloud-download" />
              </my-button>

              <my-button href="https://muffnlabs.de/static/ranking-queue.bplist" outlined>
                Download
                <i class="bx bx-download" />
              </my-button>
            </div>

            <div v-if="!scripts.length" style="align-self: center; margin: 0px 50px">
              <loading-spinner />
            </div>
            <template v-else>
              <div v-for="(item, index) in scripts" :key="index" class="card">
                <h3>{{ item.title }}</h3>
                <div v-html="item.description" />
                <p class="updated_at">
                  Last updated:
                  {{ new Date(item.updated_at).toLocaleDateString() }}
                </p>

                <div class="buttons">
                  <my-button outlined :href="item.source">
                    Source
                    <i class="bx bx-code-alt" />
                  </my-button>

                  <my-button outlined :href="item.executable">
                    Download
                    <i class="bx bxs-download" />
                  </my-button>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <div class="misc">
        <!-- sorry not sorry -->
        <div
          v-if="!links.length"
          style="display: flex; width: 100%; justify-content: center; margin-top: 100px"
        >
          <loading-spinner />
        </div>
        <template v-else>
          <div v-for="cat in linkCategories" :key="cat" class="col">
            <div class="title_container">
              <h2 class="title">
                {{ getCategoryName(cat) }}
              </h2>
            </div>
            <ul>
              <li v-for="(item, index) in getLinks(cat)" :key="index">
                <a target="_blank" :href="item.link">{{ item.name }}</a>
              </li>
            </ul>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { fixWalls, convertToDots } from '@/assets/Helpers'

export default {
  data () {
    return {
      bpm: '',
      scripts: [],
      links: [],
      dotsConverter: {
        obstacles: true,
        lights: true,
        bookmarks: true
      }
    }
  },
  computed: {
    linkCategories () {
      const links = this.links.map(conf => conf.category)
      return [...new Set(links)] // makes it unique
    }
  },
  async created () {
    this.scripts = await this.$defaultApi.$get('general/scripts')
    this.links = await this.$defaultApi.$get('general/links')
  },
  methods: {
    convertToDots (input) {
      convertToDots(input, this.dotsConverter)
    },
    fixWalls (input) {
      fixWalls(input, this.bpm)
    },
    getCategoryName (category) {
      if (category == 'hsv') { return 'HSV' }
      if (category == 'customnotes') { return 'Custom Notes' }
      return category.charAt(0).toUpperCase() + category.slice(1)
    },
    getLinks (category) {
      return this.links.filter(conf => conf.category == category)
    }
  }
}
</script>

<style lang="scss">
.tools {
    .vs-input-parent {
        margin: 15px;
        width: 100%;
    }

    .cards {
        display: flex;
        flex-wrap: wrap;

        .card {
            height: 100%;
            max-width: 500px;
        }
    }

    p {
        flex: 1;
        // margin-bottom: 10px;
    }

    .buttons {
        display: flex;
        margin-top: 5px;
        justify-content: flex-end;
    }

    a {
        text-decoration: none;
    }
}
.misc {
    display: flex;
    flex-wrap: wrap;
    .col {
        flex: inherit;
    }

    ul {
        list-style: initial;
        padding-left: 40px;
    }

    li {
        color: white;
        margin-bottom: 7px;
    }

    a {
        color: var(--primary-color);
        font-weight: bold;
    }
}
</style>
