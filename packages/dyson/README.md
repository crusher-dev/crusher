Access here: https://crusher-storybook.vercel.app/

Dyson is fast and sleek component library built for Crusher.

Library is opinionated and geared towards dark theme. The goal is to create UI in fast manner which feels good.

# Using Dyson

1.) You can use this as esm module. Which will be better approach. - Generate stylesheet and include it in your app.

2.) Or use Dist folder which is compiler form of code.

3.) Emotion, tailwind, react are peer dependencies.

Important - Make sure to include style sheet.

# Writing components

1.) To watch style run yarn watchStyle to monitor style changes.

2.) Write components and variant first. Look more into component drive development.

3.) Write docs and place component according to atomic design pattern. - Add know support - Add figma link

4.) Use composition pattern than prop pattern for flexibility.

5.) Components should be defined by design, we're just writing implementation.

5.) Define type and description clearly.

IMP :- This library is maintained by Himanshu and we're using middle down approach to create design library and system.
So it's always evolving and can change spec in early days.

Wait for V1 if you want stable version.

# Inculding style

-   Include style separately. It's not part of the JS bundle.
-   If you're developing on Crusher. You can use same style tailwind in crusher-app, crusher-app includes this already.
