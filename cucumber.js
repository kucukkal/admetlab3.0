module.exports = {
    default: {
        requireModule: ["ts-node/register"],
        require: ["src/world.ts", "src/support/**/*.ts","src/steps/**/*.ts"],
        format: ["progress"]
    }
};