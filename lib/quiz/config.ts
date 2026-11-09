/**
 * Launch switch for the daily quiz.
 *
 * false: /quiz works but is hidden from search engines and the sitemap, and no page links to it.
 * true:  /quiz is indexed, listed in the sitemap and linked from the site.
 *
 * Turn it on only after every item in docs/product/quiz-launch-checklist.md section 1 is done
 * (all answers checked against UPSC's official key).
 */
export const QUIZ_LIVE = true;
