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
          }
        }
    }
}
