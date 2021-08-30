<template>
    <div class="miscellaneous">
        <div class="content">
            <vs-alert color="primary">
                If you have any additions for anything here let me know on discord.
            </vs-alert>

            <div class="col">
                <div class="title_container">
                    <h2 class="title">Useful links</h2>
                </div>
                <ul>
                    <li>
                        <a target="_blank" href="https://skystudioapps.com/bs-viewer/"
                            >+1 Rabbit's BS Viewer - Map preview in browser</a
                        >
                    </li>
                    <li>
                        <a target="_blank" href="https://skystudioapps.com/mapping-tools/"
                            >+1 Rabbit's Mapping Tools - Very helpful if you're a mapper</a
                        >
                    </li>
                    <li>
                        <a target="_blank" href="https://scoresaber.com/">Scoresaber - Leaderboards & Ranking System</a>
                    </li>
                    <li>
                        <a target="_blank" href="https://hitbloq.com/">Hitbloq - Alternative Ranking System</a>
                    </li>
                    <li>
                        <a target="_blank" href="https://beat-savior.herokuapp.com/#/"
                            >Beat Savior - Scoresaber Ranking Stats Tool</a
                        >
                    </li>
                    <li>
                        <a target="_blank" href="https://scoresaber.balibalo.xyz"
                            >Balibalo Tools - PP Calculator, Top 200 PP Playlist, etc.
                        </a>
                    </li>
                    <li>
                        <a target="_blank" href="https://cmlsc.itch.io/beat-saber-song-downloader"
                            >DaFluffyPotato's Beat Saber Song Downloader/Installer</a
                        >
                    </li>
                    <li>
                        <a
                            target="_blank"
                            href="https://docs.google.com/document/d/1FwG_Zv5FcB2UpjTxmH1y5-cQ85W2ezwr4z_D6_Z_QPY/edit#heading=h.v70h5b4th1j1"
                            >Tracking/Scoring on Oculus</a
                        >
                    </li>
                    <li>
                        <a target="_blank" href="https://steamcommunity.com/sharedfiles/filedetails/?id=1805934840"
                            >Downgrading Guide for Beat Saber Steam Version</a
                        >
                    </li>
                </ul>
            </div>

            <div class="col">
                <div class="title_container">
                    <h2 class="title">Grips</h2>
                </div>
                <ul>
                    <li>
                        <a
                            target="_blank"
                            href="https://cdn.discordapp.com/attachments/401173069001129984/515257917927325717/Oculus_Grips_Guide.png"
                            >Rift Grips</a
                        >
                    </li>
                    <li>
                        <a
                            target="_blank"
                            href="https://media.discordapp.net/attachments/585906960164192315/715617955261448202/unknown.png"
                            >Rift S and Quest Grips</a
                        >
                    </li>
                    <li>
                        <a target="_blank" href="https://bsmg.wiki/assets/img/vive-grips-guide.d9b6ee34.png"
                            >Vive Grips</a
                        >
                    </li>
                    <li>
                        <a
                            target="_blank"
                            href="https://media.discordapp.net/attachments/585906960164192315/708893196687769610/PSVR_Grips.png"
                            >PS VR Grips</a
                        >
                    </li>
                </ul>
            </div>

            <div class="col">
                <div class="title_container">
                    <h2 class="title">Useful discords</h2>
                </div>
                <ul>
                    <li>
                        <a target="_blank" href="https://discord.gg/beatsabermods"
                            >Beat Saber Modding Group - Modding stuff</a
                        >
                    </li>
                    <li>
                        <a target="_blank" href="https://discord.gg/WpuDMwU"
                            >Scoresaber - Leaderboards & Ranking stuff</a
                        >
                    </li>
                    <li>
                        <a target="_blank" href="https://discord.gg/dwe8mbC">Cube Community - Community stuff</a>
                    </li>
                    <li>
                        <a target="_blank" href="https://discord.gg/5NjfSAC">BeatKhana! - Tournament stuff</a>
                    </li>
                    <li>
                        <a target="_blank" href="https://discordapp.com/invite/pxWwtWJ"
                            >Hitbloq - Alternative Ranking stuff</a
                        >
                    </li>
                    <li>
                        <a target="_blank" href="https://discord.gg/EdRYahH">Refugee Camp - :)</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    transition: "slide-bottom"
};
</script>

<style lang="scss">
.miscellaneous {
    .col {
        flex: inherit;
    }

    li {
        color: white;
    }

    a {
        color: rgb(var(--vs-primary));
        font-weight: bold;
    }
}
</style>
