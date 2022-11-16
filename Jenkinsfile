env.CI = 'false'
pipeline {
    agent any
    stages {
        stage('build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
        stage('deploy') {
            steps {
              sh 'echo "deploy"'
              sh 'ls'
              sh 'docker build -t recording-admin-nginx .'
              sh 'docker stop recording-admin-container'
              sh 'docker rm recording-admin-container'
              sh 'docker run --name recording-admin-container -p 80:80 -d recording-admin-nginx'
            }
        }
    }
}
