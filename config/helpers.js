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
    const profiles = projectConfig.profiles || {};
    const variables = profiles[profileName];
    const defaultVariables = defaultProfileConfig[profileName];

    return Object.assign({}, defaultVariables, variables);
}

module.exports = {
    getArtifactsDirectory,
    makePathToArtifact,
    getProfileVariables,
};
