REPO="inuverse44/homepage" ./scripts/setup-gcp-wif.sh


 REPO="inuverse44/homepage" ./scripts/setup-gcp-wif.sh


  gcloud iam workload-identity-pools providers delete github-provider \
    　　--project=inuverse-homepage \
    　　--location=global \
    　　--workload-identity-pool=github-pool --quiet

 gcloud iam workload-identity-pools delete github-pool \
    　　--project=inuverse-homepage \
   　　　--location=global --quiet
