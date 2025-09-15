// Jenkinsfile (Updated for Frontend and Backend)

pipeline {
    agent any

    environment {
        // --- APNI DETAILS YAHAN DAALEIN ---
        DOCKER_HUB_USERNAME  = 'vaibhavsingh2910' // Aapka Docker Hub Username
        BACKEND_IMAGE_NAME   = 'my-cool-app' // Docker Hub par backend repo ka naam
        FRONTEND_IMAGE_NAME  = 'my-frontend-app' // Docker Hub par frontend repo ka naam
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo 'Cloning the repository...'
                checkout scm
            }
        }

        stage('Build & Push Images') {
            steps {
                script {
                    // Jenkins Credentials se Docker Hub login karein
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                        sh "docker login -u ${DOCKER_USER} -p ${DOCKER_PASS}"

                        // Backend Image Build & Push
                        echo "Building backend image..."
                        def backendImage = "${env.DOCKER_HUB_USERNAME}/${env.BACKEND_IMAGE_NAME}:${env.BUILD_NUMBER}"
                        sh "docker build -t ${backendImage} ./backend"
                        echo "Pushing backend image..."
                        sh "docker push ${backendImage}"

                        // Frontend Image Build & Push
                        echo "Building frontend image..."
                        def frontendImage = "${env.DOCKER_HUB_USERNAME}/${env.FRONTEND_IMAGE_NAME}:${env.BUILD_NUMBER}"
                        sh "docker build -t ${frontendImage} ./frontend"
                        echo "Pushing frontend image..."
                        sh "docker push ${frontendImage}"
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo "Deploying to Kubernetes cluster..."
                withKubeconfig(credentialsId: 'my-kubeconfig') { // Agar zaroorat ho to isse configure karein
                    script {
                        def backendImage = "${env.DOCKER_HUB_USERNAME}/${env.BACKEND_IMAGE_NAME}:${env.BUILD_NUMBER}"
                        def frontendImage = "${env.DOCKER_HUB_USERNAME}/${env.FRONTEND_IMAGE_NAME}:${env.BUILD_NUMBER}"
                        
                        // Backend Deployment ko update karein
                        echo "Updating backend deployment..."
                        sh "kubectl set image deployment/backend-deployment backend-app=${backendImage}"

                        // Frontend Deployment ko update karein
                        echo "Updating frontend deployment..."
                        sh "kubectl set image deployment/frontend-deployment frontend-app=${frontendImage}"
                        
                        echo "Waiting for rollout to finish..."
                        sh "kubectl rollout status deployment/backend-deployment"
                        sh "kubectl rollout status deployment/frontend-deployment"
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished. Cleaning up...'
            sh 'docker logout'
        }
    }
}
