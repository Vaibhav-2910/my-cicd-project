pipeline {
    agent any

    stages {
        stage('1. Git Clone') {
            steps {
                echo 'Cloning repository...'
                git branch: 'main', url: 'https://github.com/Vaibhav-2910/my-cicd-project.git'
            }
        }

        stage('2. Build Images') {
            steps {
                script {
                    echo "Building images..."
                    sh 'eval $(minikube -p minikube docker-env)'
                    sh "docker build -t backend-app:${BUILD_NUMBER} ./backend"
                    sh "docker build -t frontend-app:${BUILD_NUMBER} ./frontend"
                }
            }
        }

        stage('3. Deploy to Kubernetes') {
            steps {
                echo 'Applying Kubernetes manifests...'
                // Pehli baar deploy karne ke liye manifests apply karein
                sh "kubectl apply -f k8s/"
                
                echo 'Updating image tags in deployments...'
                // Nayi image ke saath deployments update karein
                sh "kubectl set image deployment/backend-deployment backend-app=backend-app:${BUILD_NUMBER}"
                sh "kubectl set image deployment/frontend-deployment frontend-app=frontend-app:${BUILD_NUMBER}"
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline finished successfully! Application deployed.'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
