const defaultProfileConfig = require("./default-profile");

function getArtifactsDirectory(config, absolute = false) {
    const absBuildPath = absolute
        ? `${config.buildPath}/`
        : "";

    const artifactsDirName = config.moveBuildArtifactsToSubfolder
        ? `${config.moveBuildArtifactsToSubfolder}/`
        : "";

    return absBuildPath + artifactsDirName;
}

function makePathToArtifact(artifactName, config) {
    return getArtifactsDirectory(config) + artifactName;
}

function getProfileVariables(profileName, projectConfig) {
    const variables = projectConfig.profiles[profileName];
    const defaultVariables = defaultProfileConfig[profileName];

    if (!variables) {
        throw new Error(`Can't find profile '${profileName}'`);
    }

    return Object.assign({}, defaultVariables, variables);
}

module.exports = {
    getArtifactsDirectory,
    makePathToArtifact,
    getProfileVariables,
};
