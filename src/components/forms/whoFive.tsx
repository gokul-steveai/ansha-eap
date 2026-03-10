import WHO5FormComponent from "./formWhoFive";

const WhoFiveSurvey = () => {
  return (
    <div className="card">
      <h2>The World Health Organization-Five Well-Being Index (WHO-5)</h2>
      <p>
        Please indicate for each of the five statements which is closest to how
        you have been feeling over the last two weeks. Notice that higher
        numbers mean better well-being.
      </p>
      <p>
        Example. If you have felt cheerful and in good spirits more than half of
        the time during the last two weeks, select number three.{" "}
      </p>

      <WHO5FormComponent />
    </div>
  );
};

export default WhoFiveSurvey;
