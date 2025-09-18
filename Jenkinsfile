
// final-cicd-project/Jenkinsfile

pipeline {
    agent any

    environment {
        // --- APNI DETAILS YAHAN DAALEIN ---
        DOCKER_HUB_USERNAME  = 'vaibhavsingh2910'     // <-- APNA USERNAME YAHAN DAALEIN
        BACKEND_IMAGE_NAME   = 'my-cool-app'  // <-- APNI BACKEND REPO KA NAAM YAHAN DAALEIN
        FRONTEND_IMAGE_NAME  = 'my-frontend-app' // <-- APNI FRONTEND REPO KA NAAM YAHAN DAALEIN

    }

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Code checked out successfully.'
                checkout scm
            }
        }

        stage('Build & Push Images with Podman') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                        sh "podman login docker.io -u ${DOCKER_USER} -p ${DOCKER_PASS}"
                        
                        def backendImage = "docker.io/${env.DOCKER_HUB_USERNAME}/${env.BACKEND_IMAGE_NAME}:${env.BUILD_NUMBER}"
                        sh "podman build -t ${backendImage} ./backend"
                        sh "podman push ${backendImage}"
                        
                        def frontendImage = "docker.io/${env.DOCKER_HUB_USERNAME}/${env.FRONTEND_IMAGE_NAME}:${env.BUILD_NUMBER}"
                        sh "podman build -t ${frontendImage} ./frontend"
                        sh "podman push ${frontendImage}"
                    }
                }
            }
        }

        stage('Deploy to Minikube') {
            steps {
                script {
                    def backendImage = "docker.io/${env.DOCKER_HUB_USERNAME}/${env.BACKEND_IMAGE_NAME}:${env.BUILD_NUMBER}"
                    def frontendImage = "docker.io/${env.DOCKER_HUB_USERNAME}/${env.FRONTEND_IMAGE_NAME}:${env.BUILD_NUMBER}"
                    
                    sh "kubectl set image deployment/backend-deployment backend-app=${backendImage}"
                    sh "kubectl set image deployment/frontend-deployment frontend-app=${frontendImage}"
                    
                    sh "kubectl rollout status deployment/backend-deployment"
                    sh "kubectl rollout status deployment/frontend-deployment"
                }
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline finished.'
            sh 'podman logout docker.io'
        }
    }
}
