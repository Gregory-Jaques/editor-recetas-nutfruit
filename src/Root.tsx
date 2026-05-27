import {Composition, Folder} from "remotion";

// Nutfruit Recetas YouTube assets
import {RecipeIntro} from "./compositions/nutfruit-recetas/RecipeIntro";
import {Ingredients} from "./compositions/nutfruit-recetas/Ingredients";
import {StepCard} from "./compositions/nutfruit-recetas/StepCard";
import {OutroText} from "./compositions/nutfruit-recetas/OutroText";

// Compositions
import {ShowcaseComposition} from "./compositions/Showcase";
import {NutfruitVertical} from "./compositions/NutfruitVertical";
import {NutfruitVerticalFull} from "./compositions/NutfruitVerticalFull";
import {LTTest} from "./compositions/LTTest";

// Social templates
import {TikTokVideo} from "./templates/social/TikTokVideo";
import {InstagramReel} from "./templates/social/InstagramReel";
import {YouTubeShort} from "./templates/social/YouTubeShort";

// Content templates
import {Presentation} from "./templates/content/Presentation";
import {Testimonial} from "./templates/content/Testimonial";

// Promo templates
import {Announcement} from "./templates/promo/Announcement";
import {BeforeAfterDemo} from "./compositions/BeforeAfterDemo";
import {PecanaBonitoVertical} from "./compositions/PecanaBonitoVertical";
import {ChilaquilesYouTube} from "./compositions/ChilaquilesYouTube";
import {FlautasYouTube} from "./compositions/FlautasYouTube";
import {CapirotadaYouTube} from "./compositions/CapirotadaYouTube";
import {TresLechesYouTube} from "./compositions/TresLechesYouTube";
import {FlautasVegetalesYouTube} from "./compositions/FlautasVegetalesYouTube";
import {CacajuVertical} from "./compositions/CacajuVertical";
import {AvellanasVertical} from "./compositions/AvellanasVertical";
import {StreamerVertical} from "./compositions/StreamerVertical";
import {ConductoraVertical} from "./compositions/ConductoraVertical";
import {NutfruitThailandJabKhu} from "./compositions/NutfruitThailandJabKhu";

// Editing templates
import {TalkingHeadEdit} from "./templates/editing/TalkingHeadEdit";
import {PodcastClip} from "./templates/editing/PodcastClip";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Nutfruit">
        <Composition
          id="LTTest"
          component={LTTest}
          durationInFrames={150}
          fps={25}
          width={1920}
          height={1080}
        />
        <Composition
          id="NutfruitVertical"
          component={NutfruitVertical}
          durationInFrames={1500}
          fps={25}
          width={1080}
          height={1920}
        />
        <Composition
          id="NutfruitVerticalFull"
          component={NutfruitVerticalFull}
          durationInFrames={1500}
          fps={25}
          width={1080}
          height={1920}
          defaultProps={{videoSrc: "assets/nutfruit.mp4"}}
        />
        <Composition
          id="Receta1"
          component={NutfruitVerticalFull}
          durationInFrames={1500}
          fps={25}
          width={1080}
          height={1920}
          defaultProps={{videoSrc: "assets/nuevo.mp4"}}
        />
      </Folder>

      <Folder name="NutfruitThailand">
        <Composition
          id="NTH-JabKhu"
          component={NutfruitThailandJabKhu}
          durationInFrames={432}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>

      <Folder name="Conductora">
        <Composition
          id="Conductora"
          component={ConductoraVertical}
          durationInFrames={1175}
          fps={25}
          width={1080}
          height={1920}
        />
      </Folder>

      <Folder name="Streamer">
        <Composition
          id="Streamer"
          component={StreamerVertical}
          durationInFrames={2000}
          fps={25}
          width={1080}
          height={1920}
        />
      </Folder>

      <Folder name="Receta4">
        <Composition
          id="Receta4"
          component={AvellanasVertical}
          durationInFrames={1500}
          fps={25}
          width={1080}
          height={1920}
        />
      </Folder>

      <Folder name="Receta3">
        <Composition
          id="Receta3"
          component={CacajuVertical}
          durationInFrames={1283}
          fps={24}
          width={1080}
          height={1920}
        />
      </Folder>

      <Folder name="Receta2">
        <Composition
          id="Receta2"
          component={PecanaBonitoVertical}
          durationInFrames={1338}
          fps={24}
          width={1080}
          height={1920}
        />
      </Folder>

      <Folder name="FlautasVegetalesYT">
        <Composition
          id="FlautasVegetalesYT"
          component={FlautasVegetalesYouTube}
          durationInFrames={1570}
          fps={25}
          width={1920}
          height={1080}
        />
      </Folder>

      <Folder name="TresLechesYT">
        <Composition
          id="TresLechesYT"
          component={TresLechesYouTube}
          durationInFrames={1710}
          fps={25}
          width={1920}
          height={1080}
        />
      </Folder>

      <Folder name="CapirotadaYT">
        <Composition
          id="CapirotadaYT"
          component={CapirotadaYouTube}
          durationInFrames={1385}
          fps={25}
          width={1920}
          height={1080}
        />
      </Folder>

      <Folder name="FlautasYT">
        <Composition
          id="FlautasYT"
          component={FlautasYouTube}
          durationInFrames={1572}
          fps={25}
          width={1920}
          height={1080}
        />
      </Folder>

      <Folder name="ChilaquilesYT">
        <Composition
          id="ChilaquilesYT"
          component={ChilaquilesYouTube}
          durationInFrames={1241}
          fps={25}
          width={1920}
          height={1080}
        />
      </Folder>

      <Folder name="NutfruitRecetas">
        <Composition
          id="NR-RecipeIntro"
          component={RecipeIntro}
          durationInFrames={140}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            line1: "VINAGRETA DE AVELLANAS",
            line2: "Y CIRUELAS PASAS",
            position: "top",
          }}
        />
        <Composition
          id="NR-Ingredients"
          component={Ingredients}
          durationInFrames={210}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            title: "INGREDIENTES",
            columns: 1,
            ingredients: [
              {name: "Avellanas tostadas",  amount: "200g"},
              {name: "Mantequilla sin sal", amount: "80g"},
              {name: "Azúcar moreno",       amount: "120g"},
              {name: "Huevos",              amount: "3 uds"},
              {name: "Harina de trigo",     amount: "160g"},
              {name: "Cacao en polvo",      amount: "40g"},
              {name: "Sal",                 amount: "1 pizca"},
            ],
          }}
        />
        <Composition
          id="NR-StepCard"
          component={StepCard}
          durationInFrames={140}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            stepNumber: 1,
            stepDescription: "PROCESA TODOS\nLOS INGREDIENTES",
            corner: "bottomRight",
          }}
        />
        <Composition
          id="NR-OutroText"
          component={OutroText}
          durationInFrames={160}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            line1: "¡BUEN",
            line2: "PROVECHO!",
            hashtag: "#NutfruitRecetas",
            cta: "Síguenos para más recetas saludables",
            position: "center",
          }}
        />
      </Folder>

      <Folder name="Examples">
        <Composition
          id="Showcase"
          component={ShowcaseComposition}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      <Folder name="Social">
        <Composition
          id="TikTok"
          component={TikTokVideo}
          durationInFrames={270}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            hook: "Did you know this?",
            body: "AI can edit videos now using just code.",
            cta: "Follow for more",
          }}
        />
        <Composition
          id="InstagramReel"
          component={InstagramReel}
          durationInFrames={240}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            headline: "Your headline here",
            subtext: "Supporting text goes here",
            brandName: "Brand",
          }}
        />
        <Composition
          id="YouTubeShort"
          component={YouTubeShort}
          durationInFrames={300}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            title: "Your Title Here",
            subtitle: "Subtitle goes here",
          }}
        />
      </Folder>

      <Folder name="Content">
        <Composition
          id="Presentation"
          component={Presentation}
          durationInFrames={450}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            slides: [
              {title: "Welcome", body: "This is slide one"},
              {title: "The Problem", body: "Here's what we're solving"},
              {title: "The Solution", body: "Here's how we solve it"},
            ],
          }}
        />
        <Composition
          id="Testimonial"
          component={Testimonial}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            quote:
              "This product completely changed how we work. Highly recommended.",
            author: "Jane Doe",
            role: "CEO at Company",
          }}
        />
      </Folder>

      <Folder name="Promo">
        <Composition
          id="Announcement"
          component={Announcement}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            preTitle: "Introducing",
            title: "Something Amazing",
            subtitle: "The future is here",
            cta: "Learn More",
          }}
        />
        <Composition
          id="BeforeAfter"
          component={BeforeAfterDemo}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      <Folder name="Editing">
        <Composition
          id="TalkingHeadEdit"
          component={TalkingHeadEdit}
          durationInFrames={900}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            videoSrc: "assets/video.mp4",
            showCaptions: true,
            captionPreset: "bold" as const,
            removeSilence: false,
          }}
        />
        <Composition
          id="PodcastClip"
          component={PodcastClip}
          durationInFrames={900}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            videoSrc: "assets/video.mp4",
            clipStartSeconds: 0,
            clipEndSeconds: 30,
            showCaptions: true,
            captionPreset: "bold" as const,
          }}
        />
      </Folder>
    </>
  );
};
