const kibanaService = require('../services/kibanaService');


const getErrorMetrics = async (req, res) => {
  const now = new Date();
  const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

  const formatDate = (date) => {
    return date.toISOString(); // Converts date to the format 'YYYY-MM-DDTHH:mm:ss.sssZ'
  };

  const body = {
    aggs: {
      2: {
        significant_terms: {
          field: 'fields.site.keyword',
          size: 100,
        },
        aggs: {
          3: {
            significant_terms: {
              field: 'host.hostname.keyword',
              size: 500,
            },
            aggs: {
              4: {
                significant_terms: {
                  field: 'loglevel.keyword',
                  size: 8,
                },
              },
            },
          },
        },
      },
    },
    size: 0,
    fields: [
      {
        field: '@timestamp',
        format: 'date_time',
      },
    ],
    query: {
      bool: {
        filter: [
          {
            range: {
              '@timestamp': {
                format: 'strict_date_optional_time',
                gte: formatDate(fifteenMinutesAgo),
                lte: formatDate(now),
              },
            },
          },
        ],
        must_not: [
          { match_phrase: { 'loglevel.keyword': 'INFO' } },
          { match_phrase: { 'loglevel.keyword': 'DEBUG' } },
        ],
      },
    },
  };

  try {
    const data = await kibanaService.postToKibana('ekarasa*/_search', body);
    res.json(data);
  } catch (error) {
    console.error('Error fetching error metrics:', error);
    res.status(500).json({ error: 'Error fetching error metrics' });
  }
};


const getCountLogs = async (req, res) => {
  const now = new Date();
  const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

  const formatDate = (date) => {
    return date.toISOString(); // Converts date to the format 'YYYY-MM-DDTHH:mm:ss.sssZ'
  };
  const body = {
    aggs: {
      2: {
        terms: {
          field: 'loglevel.keyword',
          order: { _count: 'desc' },
          size: 5,
        },
      },
    },
    size: 0,
    fields: [
      {
        field: '@timestamp',
        format: 'date_time',
      },
    ],
    query: {
      bool: {
        filter: [
          {
            range: {
              '@timestamp': {
                format: 'strict_date_optional_time',
                gte: formatDate(fifteenMinutesAgo),
                lte: formatDate(now),
              },
            },
          },
        ],
      },
    },
  };

  try {
    const data = await kibanaService.postToKibana('ekarasa*/_search', body);
    res.json(data);
  } catch (error) {
    console.error('Error fetching count logs:', error);
    res.status(500).json({ error: 'Error fetching count logs' });
  }
};

const getLogs = async (req, res) => {
  const now = new Date();
  const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

  const formatDate = (date) => {
    return date.toISOString(); // Converts date to the format 'YYYY-MM-DDTHH:mm:ss.sssZ'
  };
  const body = {
    track_total_hits: false,
    sort: [
      {
        '@timestamp': {
          order: 'desc',
        },
      },
    ],
    fields: [
      { field: '*', include_unmapped: 'true' },
      { field: '@timestamp', format: 'strict_date_optional_time' },
    ],
    size: 500,
    query: {
      bool: {
        filter: [
          {
            range: {
              '@timestamp': {
                format: 'strict_date_optional_time',
                gte: formatDate(fifteenMinutesAgo),
                lte: formatDate(now),
              },
            },
          },
        ],
      },
    },
    highlight: {
      pre_tags: ['@kibana-highlighted-field@'],
      post_tags: ['@/kibana-highlighted-field@'],
      fields: {
        '*': {},
      },
      fragment_size: 2147483647,
    },
  };

  try {
    const data = await kibanaService.postToKibana('ekarasa*/_search', body);
    res.json(data);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Error fetching logs' });
  }
};
/*******************************************************************************/
const getErrorByTime = async (req, res) => {
  const now = new Date();
  const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

  const formatDate = (date) => {
    return date.toISOString(); // Converts date to the format 'YYYY-MM-DDTHH:mm:ss.sssZ'
  };
  const body = {
    aggs: {
      2: {
        date_histogram: {
          field: '@timestamp',
          fixed_interval: '30s',
          time_zone: 'Africa/Tunis',
          min_doc_count: 1,
        },
        aggs: {
          3: {
            significant_terms: {
              field: 'loglevel.keyword',
              size: 8,
            },
          },
        },
      },
    },
    size: 0,
    fields: [
      {
        field: '@timestamp',
        format: 'date_time',
      },
    ],
    query: {
      bool: {
        filter: [
          {
            range: {
              '@timestamp': {
                format: 'strict_date_optional_time',
                gte: formatDate(fifteenMinutesAgo),
                lte: formatDate(now),
              },
            },
          },
        ],
        must_not: [
          { match_phrase: { 'loglevel.keyword': 'DEBUG' } },
          { match_phrase: { 'loglevel.keyword': 'INFO' } },
        ],
      },
    },
  };

  try {
    const data = await kibanaService.postToKibana('ekarasa*/_search', body);
    res.json(data);
  } catch (error) {
    console.error('Error fetching error by time:', error);
    res.status(500).json({ error: 'Error fetching error by time' });
  }
};
/*************************************************************************************** */
const getTotalLogs = async (req, res) => {
  const now = new Date();
  const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

  const formatDate = (date) => {
    return date.toISOString(); // Converts date to the format 'YYYY-MM-DDTHH:mm:ss.sssZ'
  };
  const body = {
    size: 0,
    fields: [
      {
        field: '@timestamp',
        format: 'date_time',
      },
    ],
    query: {
      bool: {
        filter: [
          {
            range: {
              '@timestamp': {
                format: 'strict_date_optional_time',
                gte: formatDate(fifteenMinutesAgo),
                lte: formatDate(now),
              },
            },
          },
        ],
      },
    },
  };

  try {
    const data = await kibanaService.postToKibana('rsylog-*/_search', body);
    res.json(data);
  } catch (error) {
    console.error('Error fetching total logs:', error);
    res.status(500).json({ error: 'Error fetching total logs' });
  }
};
/********************************************************************************************** */
const getLastMeasures = async (req, res) => {
  const now = new Date();
  const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

  const formatDate = (date) => {
    return date.toISOString(); // Converts date to the format 'YYYY-MM-DDTHH:mm:ss.sssZ'
  };
  const body = {
    "aggs": {
      "4": {
        "filters": {
          "filters": {
            "\"Sending results\"": {
              "bool": {
                "must": [],
                "filter": [
                  {
                    "multi_match": {
                      "type": "phrase",
                      "query": "Sending results",
                      "lenient": true
                    }
                  }
                ],
                "should": [],
                "must_not": []
              }
            }
          }
        },
        "aggs": {
          "3": {
            "terms": {
              "field": "host.name.keyword",
              "order": {
                "_key": "desc"
              },
              "size": 600
            }
          }
        }
      }
    },
    "size": 0,
    "fields": [
      {
        "field": "@timestamp",
        "format": "date_time"
      }
    ],
    "script_fields": {},
    "stored_fields": [
      "*"
    ],
    "runtime_mappings": {},
    "_source": {
      "excludes": []
    },
    "query": {
      "bool": {
        "must": [],
        "filter": [
          {
            "range": {
              "@timestamp": {
                "format": 'strict_date_optional_time',
                "gte": formatDate(fifteenMinutesAgo),
                "lte": formatDate(now),
              }
            }
          }
        ],
        "should": [],
        "must_not": []
      }
    }
  };
  try {
    const data = await kibanaService.postToKibana('ekarasa*/_search', body);
    res.json(data);
  } catch (error) {
    console.error('Error fetching last measures:', error);
    res.status(500).json({ error: 'Error fetching last measures' });
  }
};
/***************************************************************************** */
const getLastMeasuresByTime = async (req, res) => {
  const now = new Date();
  const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

  const formatDate = (date) => {
    return date.toISOString(); // Converts date to the format 'YYYY-MM-DDTHH:mm:ss.sssZ'
  };
  const body = {
    "aggs": {
      "2": {
        "date_histogram": {
          "field": "@timestamp",
          "fixed_interval": "30m",
          "time_zone": "Africa/Tunis",
          "min_doc_count": 1
        },
        "aggs": {
          "3": {
            "terms": {
              "field": "host.hostname.keyword",
              "order": {
                "_count": "desc"
              },
              "size": 100
            },
            "aggs": {
              "4": {
                "filters": {
                  "filters": {
                    "\"Sending results\"": {
                      "bool": {
                        "must": [],
                        "filter": [
                          {
                            "multi_match": {
                              "type": "phrase",
                              "query": "Sending results",
                              "lenient": true
                            }
                          }
                        ],
                        "should": [],
                        "must_not": []
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "size": 0,
    "fields": [
      {
        "field": "@timestamp",
        "format": "date_time"
      }
    ],
    "script_fields": {},
    "stored_fields": [
      "*"
    ],
    "runtime_mappings": {},
    "_source": {
      "excludes": []
    },
    "query": {
      "bool": {
        "must": [],
        "filter": [
          {
            "range": {
              "@timestamp": {
                "format": 'strict_date_optional_time',
                "gte": formatDate(fifteenMinutesAgo),
                "lte": formatDate(now),
              }
            }
          }
        ],
        "should": [],
        "must_not": []
      }
    }
  };
  try {
    const data = await kibanaService.postToKibana('ekarasa*/_search', body);
    res.json(data);
  } catch (error) {
    console.error('Error fetching measures by time:', error);
    res.status(500).json({ error: 'Error fetching measures by time' });
  }
};
/*******************************************DFY LOGS********************************************** */

const getActionByRobot = async (req, res) => {
  const now = new Date();
  const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

  const formatDate = (date) => {
    return date.toISOString(); // Converts date to the format 'YYYY-MM-DDTHH:mm:ss.sssZ'
  };
  const body = {
    "version": true,
    "size": 500,
    "sort": [
      {
        "@timestamp": {
          "order": "desc",
          "unmapped_type": "boolean"
        }
      }
    ],
    "fields": [
      {
        "field": "*",
        "include_unmapped": "true"
      },
      {
        "field": "@timestamp",
        "format": "strict_date_optional_time"
      }
    ],
    "script_fields": {},
    "stored_fields": [
      "*"
    ],
    "runtime_mappings": {},
    "_source": false,
    "query": {
      "bool": {
        "must": [],
        "filter": [
          {
            "bool": {
              "should": [
                {
                  "match_phrase": {
                    "DFY_Action": "START"
                  }
                },
                {
                  "match_phrase": {
                    "DFY_Action": "LOADED"
                  }
                }
              ],
              "minimum_should_match": 1
            }
          },
          {
            "range": {
              "@timestamp": {
                "format": 'strict_date_optional_time',
                "gte": formatDate(fifteenMinutesAgo),
                "lte": formatDate(now),
              }
            }
          }
        ],
        "should": [],
        "must_not": []
      }
    },
    "highlight": {
      "pre_tags": [
        "@kibana-highlighted-field@"
      ],
      "post_tags": [
        "@/kibana-highlighted-field@"
      ],
      "fields": {
        "*": {}
      },
      "fragment_size": 2147483647
    }
  };
  try {
    const data = await kibanaService.postToKibana('ekarasa*/_search', body);
    res.json(data);
  } catch (error) {
    console.error('Error fetching measures by time:', error);
    res.status(500).json({ error: 'Error fetching measures by time' });
  }
};

module.exports = {
  getErrorMetrics,
  getCountLogs,
  getLogs,
  getErrorByTime,
  getTotalLogs,
  getLastMeasures,
  getLastMeasuresByTime,
  getActionByRobot
};
