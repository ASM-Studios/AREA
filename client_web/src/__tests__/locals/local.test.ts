import en_language from "../../../locales/en";
import es_language from "../../../locales/es";
import fr_language from "../../../locales/fr";
import pirate from "../../../locales/pirate";

// Option 1: Use a local interface
interface Translation {
    // Add only the fields you need for this test
    [key: string]: any;
}

describe("local: EN", () => {
  it("should be of type Translation", () => {
    const language: Translation = en_language;
    expect(language).toBeDefined();
  });
});

describe("local: ES", () => {
  it("should be of type Translation", () => {
    const language: Translation = es_language;
    expect(language).toBeDefined();
  });
});

describe("local: FR", () => {
  it("should be of type Translation", () => {
    const language: Translation = fr_language;
    expect(language).toBeDefined();
  });
});

describe("local: Pirate", () => {
  it("should be of type Translation", () => {
    const language: Translation = pirate;
    expect(language).toBeDefined();
  });
});
