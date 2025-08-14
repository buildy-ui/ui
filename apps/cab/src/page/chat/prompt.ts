export const CHARACTER_DESCRIPTION = `The scene features the same recurring character — a confident brutalist businessman with short chestnut hair (brown color), a neat groomed, short trimmed beard, and a calm expression. He wears a white dress shirt, a red-pantone tie, berkeley-blue trousers, and a brown belt — this is his signature look`;

export const QUALITY_INSTRUCTIONS = `Clean professional illustration. Character has natural facial expression, correct human proportions and anatomy. His confident pose perfectly reveals the plot of the scene.`;

export const STYLE_INSTRUCTION = `Modern vector illustration in clean, flat editorial style. Professional illustration for websites and blogs.`;

export const COLOR_PALETTE = `Use strict this color palette consistently:
- Brown (#6c584c) for hair, belt, wooden elements
- Red-pantone (#e63946) for tie, accent elements  
- Honeydew (#f1faee) for light backgrounds, papers
- Non-photo-blue (#a8dadc) for secondary elements
- Cerulean (#457b9d) for charts, graphs
- Berkeley-blue (#1d3557) for trousers, dark elements
- Green-flower (#10b981) for success indicators, plants, background elements

The background should include clean geometric business elements (charts, graphs, gear icons) using these colors.`;

export const STYLE_ENDING = `Style is editorial, minimal, and business-oriented. Inspired only Modern Flat design. Focus on clarity and visual hierarchy.`;

export const imagePrompt = `Scene: A businessman who stands on the deck of a ship and stares down the tube. He's the captain of a startup. No inscriptions, pure illustration.

Strikt style:

${STYLE_INSTRUCTION} ${CHARACTER_DESCRIPTION}

{/*QUALITY_INSTRUCTIONS*/}

${COLOR_PALETTE}

${STYLE_ENDING}`;

// Configuration for image generation
export const imageConfig = {
  width: 1200,
  height: 800,
  seed: 44,
  model: 'flux' as const,
  nologo: true,
  private: true,
  enhance: true, 
  safe: true,
  //referrer: 'hinddy.com'
};

export const createPrompt = (scene: string) => `Scene: ${scene}

Strikt style:

${STYLE_INSTRUCTION} ${CHARACTER_DESCRIPTION}

${QUALITY_INSTRUCTIONS}

${COLOR_PALETTE}

${STYLE_ENDING}`;

export const SCENES = {
  meeting: "The businessman character in a modern conference room, standing beside a single large presentation screen showing cerulean charts. Three colleagues seated at a honeydew conference table.",
  
  thinking: "The businessman character sitting at a desk with a single laptop, one hand on chin in thoughtful pose, with 2-3 non-photo-blue lightbulb icons floating above his head. Honeydew desk surface with minimal brown accessories. No inscriptions, pure illustration.",
  
  success: "The businessman character standing confidently with arms crossed, single upward trending graph in green-flower visible on the honeydew wall behind him. Clean office environment with one plant in brown pot. No inscriptions, pure illustration.",
  
  startup: "The businessman character working at a single computer setup in a modern office, one coffee cup on desk, warm evening lighting through one window. Minimal, organized workspace. No inscriptions, pure illustration.",

  handshake: "The businessman character shaking hands with another business person in a modern office lobby. Clean honeydew background with minimal berkeley-blue geometric elements. Professional partnership scene. No inscriptions, pure illustration.",

  teamwork: "The businessman character collaborating with a diverse team around a single conference table, pointing at cerulean charts on one tablet. Everyone engaged in discussion. Modern office with green-flower plants. No inscriptions, pure illustration.",

  phone_call: "The businessman character speaking on a single smartphone while walking in a modern office corridor. Confident stride, one hand gesturing slightly. Clean honeydew walls with brown accents. No inscriptions, pure illustration.",

  laptop_work: "The businessman character focused on work at a single laptop in a modern co-working space. Clean desk with one coffee cup, non-photo-blue notebook nearby. Natural lighting from one large window. No inscriptions, pure illustration.",

  presentation: "The businessman character giving a presentation to a small audience, standing beside a single whiteboard with cerulean diagrams. Audience of 3-4 people seated. Modern training room with honeydew walls. No inscriptions, pure illustration.",

  networking: "The businessman character at a business networking event, holding one business card while talking to another professional. Modern venue with brown wooden elements and green-flower accent lighting. No inscriptions, pure illustration.",

  innovation: "The businessman character examining a single holographic display showing berkeley-blue data visualizations. Futuristic office setting with clean lines and non-photo-blue technology elements. One potted plant in brown pot. No inscriptions, pure illustration."
};

export const alternativePrompts = {
  //meeting: createPrompt(SCENES.meeting),
  //thinking: createPrompt(SCENES.thinking),
  //success: createPrompt(SCENES.success),
  //startup: createPrompt(SCENES.startup),
  //handshake: createPrompt(SCENES.handshake),
  //teamwork: createPrompt(SCENES.teamwork),
  //phone_call: createPrompt(SCENES.phone_call),
  laptop_work: createPrompt(SCENES.laptop_work),
  presentation: createPrompt(SCENES.presentation),
  networking: createPrompt(SCENES.networking),
  innovation: createPrompt(SCENES.innovation)
};
