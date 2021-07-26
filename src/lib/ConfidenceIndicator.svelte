<script>
  import { interpolateLab } from "d3-interpolate";

  export let confidence;
  let confidenceColor;

  if (confidence > 0.5) {
    confidenceColor = interpolateLab("yellow", "green")((confidence - 0.5) * 2);
  } else {
    confidenceColor = interpolateLab("red", "yellow")(confidence * 2);
  }

  $: cssVarStyles = `--confidence-color:${confidenceColor}`;
</script>

<!--prettier ignore-->
<details>
  <summary>Confidence: <span style={cssVarStyles} class="indicator">⬤</span></summary>
  <p>Our algorithm's confidence in this relationship is {Math.round(confidence * 100)}%.</p>
  <p>
    This only accounts for indicators in the <em>content</em> of the book. For more applied certainty, consider weighing
    it against metadata, such as title, year, and description.
  </p>
</details>

<style>
  details summary {
    cursor: pointer;
  }
  .indicator {
    color: var(--confidence-color, grey);
  }
  details p {
    font-size: smaller;
  }
</style>
