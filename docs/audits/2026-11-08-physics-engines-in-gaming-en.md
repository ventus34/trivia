# Audit: Physics Engines in Gaming (English)

Reviewed the description and all 100 questions, options, answer keys and explanations. The description remains appropriate and unchanged. Corrected or clarified 67 questions; the pack still contains 100. Numbers are one-based positions in the pack.

- **Technology and game attribution:** 1, 2, 3, 4, 5, 6, 7, 9, 22, 33, 49, 53, 54, 64, 71, 72, 78, 89, 95, 96, 97. Removed false blanket claims that PhysX is proprietary, corrected the characterization of Roblox's PGS as an algorithm rather than an engine, and replaced an invented DirectPhysics component and a questionable LittleBigPlanet middleware attribution. Scoped Lumberyard, Just Cause 3 and Battlefield 4 claims to relevant versions. Explained NVIDIA Blast's relationship to APEX Destruction.
- **Physics and numerical methods:** 11, 13, 16, 17, 19, 23, 24, 26, 28, 29, 31, 32, 34, 35, 37, 40, 44, 45, 46, 50, 51, 58, 59, 60, 61, 62, 63, 65, 68, 69, 73, 74, 76, 77, 79, 81, 83, 84, 86, 87, 88, 90, 92, 93, 94, 100. Corrected or qualified claims about collision filtering, screen culling, fluid methods, mass center, torque, simulation time steps, quaternion and matrix rotations, restitution, slip, damping and velocity. Reworded questions with multiple plausible answers and removed unsupported exclusivity claims.

Changed questions no longer carry their previous model's verification metadata. Unchanged questions retain their original metadata.

## Selected sources

- [NVIDIA PhysX SDK source](https://github.com/NVIDIA-Omniverse/PhysX/blob/main/physx/README.md) and [NVIDIA announcement on open-source GPU code](https://github.com/NVIDIA-Omniverse/PhysX/discussions/384); licensing varies by version.
- [Unity's built-in physics documentation](https://docs.unity3d.com/ru/2019.4/Manual/PhysicsSection.html): PhysX for 3D and Box2D for 2D; [Box2D FAQ](https://box2d.org/documentation/md_faq.html).
- [AWS on Lumberyard's PhysX integration](https://aws.amazon.com/blogs/gametech/the-winds-of-change-lumberyards-road-to-nvidia-physx-integration/) and [Lumberyard 1.27](https://aws.amazon.com/blogs/gametech/announcing-amazon-lumberyard-release-1-27/).
- [Roblox: physics solvers and PGS](https://about.roblox.com/newsroom/2020/08/improving-simulation-performance-advanced-physics-solver); [NVIDIA: PGS and TGS](https://docs.omniverse.nvidia.com/kit/docs/omni_physics/107.0/dev_guide/simulation_control/simulation_control.html).
- [Havok Physics product sheet](https://www.havok.com/wp-content/uploads/2025/03/havokphysics-productsheet.pdf), [EA: Frostbite engine](https://www.ea.com/frostbite/engine), and [Sony: original LittleBigPlanet](https://sony.mediaroom.com/2008-10-27-Play-Create-and-Share-With-PLAYSTATIONs-Groundbreaking-Genre-Defying-and-Highly-Anticipated-Release-LittleBigPlanet).
- [Just Cause 3 developer interview on Havok](https://gamingbolt.com/just-cause-3-interview-the-miracles-of-havok-and-destruction) and [NVIDIA developer forum on Blast](https://forums.developer.nvidia.com/t/strange-validation-error/228808).

## Limitations

All entries received an editorial review, supplemented by targeted documentation and source checks; individual game builds and every engine version were not independently tested. Several technologies can implement the same algorithms, and attribution may vary by game, platform or release. Questions were scoped where possible, but some nearby topics remain repeated.
