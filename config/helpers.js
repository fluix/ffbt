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

module.exports = {
    getArtifactsDirectory,
    makePathToArtifact,
};
